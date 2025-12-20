import { sum } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { product } from '../util/math';
import { parseIntegers } from '../util/parse';

function solve( input: string ) {
    const blocks = input.split( '\n\n' ).map( block => block.split('\n') );
    // the last block is the list of trees
    const trees = blocks.pop();
    return trees.filter( line => {
        const treeData = line.split( ':' );
        // the puzzle input is such that only the trees with enough area to fit all the presents with zero overlap will qualify.
        // We can simply calculate the area and compare to the total area of the presents (not even needing to consider overlap).
        // If we were to reject the trees that don't have enough area even given theoretical perfect packing, the only ones that remain are
        // the ones that pass the test below.
        return product( ...parseIntegers(treeData[0]) ) >= 9 * sum( parseIntegers(treeData[1]) );
    }).length;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        expectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => null, // define this
        expectedExampleSolution: null, // define this. Use NO_EXPECTED_EXAMPLE_SOLUTION if there is no example solution provided
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
