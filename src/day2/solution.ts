import { chunk, range, sum } from 'lodash';
import { outputAnswers } from '../output-answers';

/*
Rather than checking every single number in each range to see if it contains patterns of repeated numbers,
this solution generates patterns and checks if they are within the range.
This takes more code but runs much quicker than checking each number individually.
*/

// counts the number of IDs in the input which consist entirely of a sequences of digits repeated twice
function solve( input: string, maxFragments = 2 ): number {
    // return the sum of all invalid IDs
    return sum(
        input.split( ',' ).flatMap( rangeStr => {
            return invalidIdsInRange( rangeStr.split('-').map(str => parseInt(str)) as [number, number], maxFragments );
        })
    );
}

function invalidIdsInRange( [min, max]: [number, number], maxFragments = 2 ): number[] {
    const minDigits = min.toString().length;
    const maxDigits = max.toString().length;
    const invalidIds: number[] = [];
    const digitNums = range( minDigits, maxDigits + 1 );
    digitNums.forEach( digits => {
        range( 2, (maxFragments ?? digits) + 1 ).forEach( numFragments => {
            if ( digits % numFragments !== 0 ) {
                return; // cannot split evenly
            }

            const fragmentLength = digits / numFragments;
            let testVal: number; // this will be fragmentLength long
            if ( digits > minDigits ) {
                // test numbers starting with 1 followed by (fragmentLength - 1) zeros, i.e. 1000 for 4 digits
                testVal = Math.pow( 10, fragmentLength - 1 );
            } else {
                // split `min` into fragments
                const minFragments = chunk( `${min}`.split(''), fragmentLength ).map( arr => parseInt(arr.join('')) );
                // start with the first fragment, which might actually be too small
                testVal = minFragments[0];
            }

            let fullNum: number;
            while ( ( fullNum = parseInt(new Array(numFragments).fill(testVal).join('')) ) <= max ) {
                if ( fullNum >= min ) {
                    invalidIds.push( fullNum );
                }
                testVal++;
            }
        });
        
    });
    // return only the unique invalid IDs
    return Array.from( new Set(invalidIds) );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        expectedExampleSolution: 1227775554,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, null ),
        expectedExampleSolution: 4174379265,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
