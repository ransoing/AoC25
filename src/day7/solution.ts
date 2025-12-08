import { memoize, sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { indexesOf, mirrorGridY, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string, ignoreVisitedSplitters = true ) {
    // make a grid with the top left as the origin, and positive Y is down
    const grid = mirrorGridY( parseAsXyGrid(input) );
    const start = new XYZ( indexesOf('S', grid) );
    const firstSplitter = new XYZ([ start.x, grid[start.x].indexOf('^') ]);

    const hitSplitters = new Set<string>(); // string representations of XYZ coordinates
    // count the total number of possible paths. Memoize the recursive function to avoid recalculating paths from the same splitter
    const numPaths = memoize( (splitter: XYZ) => {
        if ( ignoreVisitedSplitters ) {
            // mark this splitter as hit so we can ignore it later
            hitSplitters.add( splitter.toString() );
        }
        return 1 + sum(
            [ splitter.plus(XYZ.xPositive), splitter.plus(XYZ.xNegative) ].map( newBeam => {
                if ( newBeam.valueIn(grid) == null ) {
                    return 0; // beam goes out of bounds
                }
                const nextYIndex = grid[newBeam.x].slice( newBeam.y ).indexOf( '^' ) + newBeam.y;
                const nextSplitter = new XYZ([ newBeam.x, nextYIndex ]);
                if ( ignoreVisitedSplitters && hitSplitters.has(nextSplitter.toString()) ) {
                    return 0; // already hit this one; don't calculate it again
                }
                return nextYIndex > newBeam.y ?
                    numPaths( new XYZ([ newBeam.x, nextYIndex ]) ) : // found the next splitter
                    0; // no more splitters for this beam
            })
        );
    }, xyz => xyz.toString() );
    return numPaths( firstSplitter );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 21,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, false ) + 1,
        exptectedExampleSolution: 40,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
