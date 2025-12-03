import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseAsYxGrid } from '../util/grid';

function solve( input: string, digits: number ) {
    const banks = parseAsYxGrid( input, char => parseInt(char) );
    return sum(
        banks.map( bank => {
            let pickedDigits: number[] = [];
            while ( pickedDigits.length < digits ) {
                // pick the largest number from a leading slice of the bank array, with the leading slice small enough so that there's
                // enough left to complete the selection
                const digitsToReserve = digits - pickedDigits.length - 1;
                const nextNum = Math.max( ...bank.slice(0, bank.length - digitsToReserve) );
                pickedDigits.push( nextNum );
                // continue with a slice of the bank after the first instance of the picked number
                bank = bank.slice( bank.indexOf(nextNum) + 1 );
            }
            return parseInt( pickedDigits.join('') );
        })
    );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input, 2 ),
        exptectedExampleSolution: 357,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, 12 ),
        exptectedExampleSolution: 3121910778619,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
