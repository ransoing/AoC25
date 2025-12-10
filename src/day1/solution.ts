import { outputAnswers } from '../output-answers';

/** returns the number of times the dial ends up at 0, given the starting position */
function solve( input: string, pos: number = 50 ) {
    const lines = input.split( '\n' );

    // map each line to the dial position after doing that operation, and count the number of times the position is a multiple of 100
    const zeroInstances = lines.map(
        line => pos += ( line[0] === 'L' ? -1 : 1) * parseInt(line.slice(1) )
    ).filter( p => p % 100 === 0 ).length;

    return { zeroInstances, pos };
}

function solve2( input: string ) {
    // take the lazy approach for part 2 - simulate turning the knob one tick at a time (i.e. convert L10 to L1 repeated ten times)
    const lines = input.split( '\n' );
    let pos = 50;
    
    return lines.reduce( (zeroInstances, line) => {
        const numTimes = parseInt( line.slice(1) );
        const result = solve( new Array(numTimes).fill(`${line[0]}1`).join('\n'), pos );
        pos = result.pos;
        return zeroInstances + result.zeroInstances;
    }, 0 );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ).zeroInstances,
        expectedExampleSolution: 3,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        expectedExampleSolution: 6,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
