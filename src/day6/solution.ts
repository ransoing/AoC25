import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { flipRowsCols, rotateGridCounterclockwise } from '../util/grid';
import { product } from '../util/math';
import { parseIntegers } from '../util/parse';

function solve( input: string ) {
    const lines = input.split( '\n' ).map( (line, i, allLines) => {
        if ( i === allLines.length - 1 ) {
            return line.trim().replaceAll( / +/g, ' ' ).split( ' ' );
        } else {
            return parseIntegers( line );
        }
    });

    const problems = flipRowsCols( lines as any );
    return sum(
        problems.map( (problem: number[]) => {
            return problem.pop() as any as string === '+' ? sum( problem ) : product( ...problem );
        })
    )
}

function solve2( input: string ) {
    const lines = input.split( '\n' );
    // extract just the last line to get the operation for each problem
    const operations = lines.pop().trim().replaceAll( / +/g, ' ' ).split( ' ' );
    // turn the input into a grid of characters, like a matrix, and use joins, trims, and splits to group numbers appropriately
    const numberGroups = rotateGridCounterclockwise(
        lines.map( line => line.split('') )
    ).map(
        row => row.join( '' ).trim()
    ).join( '\n' ).split( '\n\n' ).map(
        line => parseIntegers( line )
    ).reverse();
    return sum(
        numberGroups.map( (problem: number[], i) => {
            return operations[i] === '+' ? sum( problem ) : product( ...problem );
        })
    );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 4277556,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 3263827,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
