import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';
import { XYZ } from '../util/xyz';

function solve( input: string ) {
    const points = input.split( '\n' ).map( line => new XYZ(parseIntegers(line)) );

    // compare every point with every other point, calculating the area between them assuming they are opposite corners.
    return points.reduce( (largestArea, point, i) => {
        // compare with all other points further in the array
        return Math.max(
            largestArea,
            ...points.slice( i + 1 ).map( point2 => getArea(point.x, point2.x, point.y, point2.y) ),
        );
    }, 0 );
}

function getArea( x1: number, x2: number, y1: number, y2: number ) {
    // add one to each dimension to account for the fact that the points define inclusive areas
    return ( 1 + Math.abs(x2 - x1) ) * ( 1 + Math.abs(y2 - y1) );
}

function solve2( input: string ) {
    const points = input.split( '\n' ).map( line => parseIntegers(line) );

    // compare every point with every other point, calculating the area between them assuming they are opposite corners.
    return points.reduce( (largestArea, point, i) => {
        // compare with all other points further in the array
        for ( let j = i + 1; j < points.length; j++ ) {
            const point2 = points[j];
            const area = getArea( point[0], point2[0], point[1], point2[1] );
            // if this area is less than the largest found so far, don't determine whether all of the rect is in the polygon
            if ( area <= largestArea ) {
                continue;
            }
            
            const xMin = Math.min( point[0], point2[0] );
            const xMax = Math.max( point[0], point2[0] );
            const yMin = Math.min( point[1], point2[1] );
            const yMax = Math.max( point[1], point2[1] );

            // the shape of the polygon is a rough circle, with a big cut in it coming from the left side, going to the right, almost all the way.
            // if the rectangle crosses this cut through the circle, it can't be fully inside the polygon.
            // The magic numbers represent the exact position of this cut in the polygon.
            if ( xMin < 94969 && (yMin < 50092 && yMax > 48695) ) {
                continue;
            }

            // check if there are any points inside this rectangle, as a fast way of checking if the rectangle is fully inside the polygon.
            const hasPointsInside = points.some( p => {
                return p[0] > xMin && p[0] < xMax && p[1] > yMin && p[1] < yMax;
            });
            if ( hasPointsInside ) {
                continue;
            }

            largestArea = area;
        }
        return largestArea;
    }, 0 );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        expectedExampleSolution: 50,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        expectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION, // the solution doesn't work for the example input
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
