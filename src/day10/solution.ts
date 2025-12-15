import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';

interface IQueueItem {
    steps: number[];
    state: string;
}

function solve( input: string ) {
    const machines = parse( input );
    
    return machines.reduce( (total, machine) => {
        // do a BFS to find the shortest sequence of button presses to reach the target state
        const initialState = new Array( machine.target.length ).fill( '.' ).join( '' );
        const queue: IQueueItem[] = [{
            steps: [],
            state: initialState
        }];
        // keep track of visited states to avoid infinite loops, and initialize it with the initial state (all off)
        const visitedStates = new Set<string>([ initialState ]);
        let shortestPath: IQueueItem;
        while ( true ) {
            const currentState = queue.pop();
            // add one of each button press to the front of the array, unless it results in a state that we've already visited
            machine.buttons.find( (button, buttonIndex) => {
                const newQueueItem = {
                    steps: currentState.steps.concat( buttonIndex ),
                    state: '' // to be filled in
                };
                const newStateArray = currentState.state.split( '' );
                button.forEach( index => newStateArray[index] = newStateArray[index] === '#' ? '.' : '#' );
                newQueueItem.state = newStateArray.join( '' );
                if ( newQueueItem.state === machine.target ) {
                    shortestPath = newQueueItem;
                    return true;
                } else if ( !visitedStates.has(newQueueItem.state) ) {
                    visitedStates.add( newQueueItem.state );
                    queue.unshift( newQueueItem );
                }
            });
            if ( shortestPath != null ) {
                break;
            }
        }

        return total + shortestPath.steps.length;
    }, 0 );
}

function parse( input: string ) {
    return input.split( '\n' ).map( line => {
        const [ , targetStr, buttonsStr, joltageStr ] = line.match( /\[(.*)\] (\(.*\)) \{(.*)\}/ );
        return {
            target: targetStr, // `##..#`
            buttons: buttonsStr.split( ' ' ).map( s => parseIntegers(s) ), // `(3) (1,3) (2)` -> [ [3], [1,3], [2] ]
            joltage: parseIntegers( joltageStr ) // `{10,2,5}` -> [ 10, 2, 5 ]
        };
    });
}

/** it smells like there's a mathy solution to this problem, but I can't figure it out. This solution gets the answer in a timeframe of hours. */
function solve2( input: string ) {
    const machines = parse( input );
    // use DFS to find the shortest sequence of button presses to reach the target joltage state.
    // Since we want the fewest button presses, always attempt the buttons which affect the most counters first.
    // Simulate pushing a button a number of times simply by subtracting the target joltage states by the number of presses we make.
    return machines.reduce( (total, machine) => {
        console.log( machine.joltage.toString() );
        // sort buttons by descending number of indicators they affect
        machine.buttons.sort( (a, b) => b.length - a.length );
        const tot = total + tryPresses( machine.buttons, /*0,*/ machine.joltage, 0 );
        console.log( tot );
        return tot;
    }, 0 );
}

function tryPresses( buttons: number[][], joltageRemaining: number[], pressesSoFar: number, leastSolutionSoFar = Infinity ): number {
    // if every counter is at zero, return the number of presses so far
    if ( joltageRemaining.every(j => j === 0) ) {
        return pressesSoFar;
    // quit if there are no more buttons left
    } else if ( buttons.length === 0 ) {
        return leastSolutionSoFar;
    }

    // determine if any nonzero remaining joltages can't be lowered by the remaining buttons
    const nonzeroJoltageIndexes = joltageRemaining.map( (j, i) => j > 0 ? i : -1 ).filter( i => i >= 0 );
    const indexesInRemainingButtons = new Set( buttons.flat() );
    if ( nonzeroJoltageIndexes.some(i => !indexesInRemainingButtons.has(i)) ) {
        return leastSolutionSoFar;
    }

    // find out how many unique nonzero joltage values remain. If there are more unique values than can be solved with the remaining
    // buttons, return -1. This is only likely to happen if there are very few buttons remaining.
    if ( buttons.length <= 3 ) {
        const uniqueNonzeroJoltages = new Set<number>( joltageRemaining.filter(j => j > 0) ).size;
        if (
            buttons.length === 1 && uniqueNonzeroJoltages > 1 ||
            buttons.length === 2 && uniqueNonzeroJoltages > 3 ||
            buttons.length === 3 && uniqueNonzeroJoltages > 7
        ) {
            return leastSolutionSoFar;
        }
    }

    // determine if there is any joltage index for a nonzero remaining joltage that is only affected by one of the remaining buttons.
    // If so, then we must press that button enough times to reduce that joltage to zero.
    const indexOccurrences = new Map<number, number>();
    buttons.forEach( button => {
        button.forEach( index => {
            if ( nonzeroJoltageIndexes.includes(index) ) {
                indexOccurrences.set( index, (indexOccurrences.get(index) ?? 0) + 1 );
            }
        });
    });
    const uniqueIndex = Array.from( indexOccurrences.entries() ).find( ([index, count]) => count === 1 )?.[0];
    let minPresses = 0;
    if ( uniqueIndex != null ) {
        // find the button that affects this index
        const buttonIndex = buttons.findIndex( button => button.includes( uniqueIndex ) );
        // put this button first in the list of buttons to try, and correct the minimum number of presses needed
        const buttonToMove = buttons.splice( buttonIndex, 1 )[0];
        buttons.unshift( buttonToMove );
        minPresses = joltageRemaining[ uniqueIndex ];
    }

    // find the max number of times we can press this button without going below zero on any counter
    const maxPresses = Math.min( ...buttons[0].map(i => joltageRemaining[i]) );
    for ( let presses = maxPresses; presses >= minPresses; presses-- ) {
        if ( pressesSoFar + presses >= leastSolutionSoFar ) {
            // don't bother if this solution is already worse than the best found so far
            continue;
        }
        const newJoltageRemaining = joltageRemaining.slice();
        buttons[0].forEach( index => newJoltageRemaining[index] -= presses );
        // try pressing the next button some number of times, to see if we can get remaining joltage to zero
        const result = tryPresses( buttons.slice(1), newJoltageRemaining, pressesSoFar + presses, leastSolutionSoFar );
        leastSolutionSoFar = Math.min( result, leastSolutionSoFar );
    }
    return leastSolutionSoFar;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        expectedExampleSolution: 7,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        expectedExampleSolution: 33,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
