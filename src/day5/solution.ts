import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';
import { Range } from '../util/range';

/** returns the count of IDs that are present in the "fresh" ranges */
function solve( input: string ) {
    const { freshRanges, idsBlock } = parseInput( input );
    return idsBlock.filter(
        line => freshRanges.some(
            range => range.includesValue( parseInt(line) )
        )
    ).length;
}

/** returns the count of IDs represented by all ranges */
function solve2( input: string ) {
    const mergedRanges = Range.union( ...parseInput(input).freshRanges );
    return sum( mergedRanges.map( r => r.length() ) );
}

function parseInput( input: string ): { freshRanges: Range[], idsBlock: string[] } {
    const blocks = input.split( '\n\n' ).map( block => block.split('\n') );
    const freshRanges = blocks[0].map( line => {
        const [ start, end ] = parseIntegers( line.replace('-',' ') );
        return new Range( start, end + 1 ); // the end of a range is exclusive, but the definition from the puzzle input is inclusive
    });
    return { freshRanges, idsBlock: blocks[1] };
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 3,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 14,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
