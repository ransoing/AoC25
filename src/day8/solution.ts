import { outputAnswers } from '../output-answers';
import { product } from '../util/math';
import { parseIntegers } from '../util/parse';
import { XYZ } from '../util/xyz';

function solve( input: string, numPairs: number ) {
    const lines = input.split( '\n' );
    // sort the lines before parsing, to make it faster to set the distances Map
    const points = lines.sort().map( line => new XYZ(parseIntegers(line)) );
    const circuitForPoint: Map<string, Set<string>> = new Map(); // associates a point with what circuit it belongs to
    // the string key is "x1,y1,z1:x2,y2,z2", with the first point being the one that is sorted alphabetically first
    const distances = new Map<string, number>();
    const circuits: Set<string>[] = []; // an array of unique circuit instances
    points.forEach( (point, i) => {
        const circuit = new Set([ point.toString() ]);
        circuitForPoint.set( point.toString(), circuit );
        circuits.push( circuit );
        // calculate the euclidean distance to every other point
        for ( let j = i + 1; j < points.length; j++ ) {
            distances.set( `${point.toString()}:${points[j].toString()}`, point.distanceTo(points[j]) );
        }
    });
    // get the `numPairs` closest pairs of points and connect them
    let closestPairs = Array.from( distances.entries() )
        .sort( ( [keyA, distA], [keyB, distB] ) => distA - distB );
    if ( numPairs != null ) {
        closestPairs = closestPairs.slice( 0, numPairs );
    }
    for ( let i = 0; i < closestPairs.length; i++ ) {
        const [key] = closestPairs[i];
        const pointStrings = key.split( ':' );
        // remove all points from the smaller circuit and add them to the larger circuit
        const circuits = pointStrings.map( ps => circuitForPoint.get(ps) ).sort( (a, b) => a.size - b.size );
        if ( circuits[0] === circuits[1] ) {
            continue; // they are already in the same circuit; do nothing
        }
        circuits[0].forEach( ps => {
            circuits[1].add( ps );
            circuitForPoint.set( ps, circuits[1] );
        });
        circuits[0].clear();
        // if `numPairs` is null, we're going until all points are connected via the same circuit. If that's the case,
        // multiply the x coords of the two points that were just connected and return that as the solution.
        if ( numPairs == null && circuits[1].size === points.length ) {
            return product(
                ...pointStrings.map( ps => parseInt(ps.split(',')[0]) )
            );
        }
    }
    // sort the circuits by number of points they contain
    const sortedCircuits = Array.from( circuits ).sort( (a, b) => b.size - a.size );
    // multiply the sizes of the 3 largest circuits
    return product( ...sortedCircuits.slice(0, 3).map(c => c.size) );
}

outputAnswers({
    part1: {
        // for the example, we only want the 10 closest pairs; for the full input, 1000
        solver: ( input: string ) => solve( input, input.startsWith('162,817,812') ? 10 : 1000 ),
        exptectedExampleSolution: 40,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, null ),
        exptectedExampleSolution: 25272,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
