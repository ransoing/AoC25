import { outputAnswers } from '../output-answers';
import { forEachInGrid, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function findRemovableRolls( grid: any[][] ) {
    // loop through the grid items to see which instances of '@' have fewer than 4 adjacent '@'s
    const removableRolls: XYZ[] = [];
    forEachInGrid( grid, ( element, x, y ) => {
        const p = new XYZ([ x, y ]);
        if (
            element === '@' &&
            p.neighbors( true ).filter(
                n => n.valueIn( grid ) === '@'
            ).length < 4
        ) {
            removableRolls.push( p );
        }
    });
    return removableRolls;
}

// the solution for part 2 could run faster by only looping through the grid items that equal '@' instead of looping through the
// whole grid every time. It could be optimized even further by only checking the neighbors of the rolls that were removed in the previous
// iteration.
function solve2( input: string ) {
    const grid = parseAsXyGrid( input );
    let rollsRemoved = 0;
    let removableRolls: XYZ[];
    // remove rolls until no more can be removed, and count the total number removed
    do {
        removableRolls = findRemovableRolls( grid );
        removableRolls.forEach( p => p.setValueIn(grid, '.') );
        rollsRemoved += removableRolls.length;
    } while ( removableRolls.length > 0 );
    return rollsRemoved;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => findRemovableRolls( parseAsXyGrid(input) ).length,
        exptectedExampleSolution: 13,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 43,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
