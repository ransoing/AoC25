import { memoize, sum } from 'lodash';
import { outputAnswers } from '../output-answers';

interface INode {
    label: string;
    children: string[];
}

function parse( input: string ): Map<string, INode> {
    const nodes = new Map<string, INode>();
    // process the input, creating nodes as needed
    input.split( '\n' ).forEach( line => {
        const labels = line.replace( ':', '' ).split( ' ' );
        nodes.set( labels[0], {
            label: labels[0],
            children: labels.slice( 1 ),
        });
    });
    return nodes;
}

function solve( input: string ): number {
    const nodes = parse( input );
    const countPathsToOut = ( label: string ): number => {
        if ( label === 'out' ) {
            return 1;
        }
        return sum( nodes.get(label)?.children.map( child => countPathsToOut(child) ) ?? [] );
    };
    return countPathsToOut( 'you' );
}

interface IPathsToOut {
    pathsHittingDac: number;
    pathsHittingFft: number;
    pathsHittingBoth: number;
    pathsHittingNeither: number;
}

function solve2( input: string ): number {
    const nodes = parse( input );
    // do a depth-first search as in part 1, but keep track of how many paths to 'out' hit 'dac', 'fft', both, or neither
    const countPathsToOut = ( label: string ): IPathsToOut => {
        if ( label === 'out' ) {
            return {
                pathsHittingDac: 0,
                pathsHittingFft: 0,
                pathsHittingBoth: 0,
                pathsHittingNeither: 1
            };
        }
        return ( nodes.get(label)?.children ?? [] ).reduce( (totals, child) => {
            const childPaths = countPathsMemoized( child );
            const totalChildPaths = sum( Object.values(childPaths) );
            return {
                // all the paths from here hit 'dac' if this node is 'dac', similarly for 'fft'
                pathsHittingDac: totals.pathsHittingDac + childPaths.pathsHittingDac + ( label === 'dac' ? totalChildPaths : 0 ),
                pathsHittingFft: totals.pathsHittingFft + childPaths.pathsHittingFft + ( label === 'fft' ? totalChildPaths : 0 ),
                pathsHittingBoth: totals.pathsHittingBoth + childPaths.pathsHittingBoth + (
                    label === 'dac' ? childPaths.pathsHittingFft :
                    label === 'fft' ? childPaths.pathsHittingDac :
                    0
                ),
                pathsHittingNeither: ( label === 'dac' || label === 'fft' ) ? 0 : totals.pathsHittingNeither + childPaths.pathsHittingNeither
            };
        }, {
            pathsHittingDac: 0,
            pathsHittingFft: 0,
            pathsHittingBoth: 0,
            pathsHittingNeither: 0
        });
    };
    const countPathsMemoized = memoize( countPathsToOut );
    return countPathsMemoized( 'svr' ).pathsHittingBoth;
}



outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        expectedExampleSolution: 5,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        expectedExampleSolution: 2,
        exampleInputPath: `${__dirname}/example-input2`,
        fullInputPath: `${__dirname}/full-input`
    }
});
