"use strict";

const nodeCanvas = document.getElementById( "main" );
const context    = nodeCanvas.getContext( "2d" );

const WIDTH  = nodeCanvas.width;
const HEIGHT = nodeCanvas.height;

const pixMap = context.createImageData( WIDTH, HEIGHT );

function fractal( x, y, maxIterations, maxRadius ) {
	let real      = x;
	let imaginary = y;

	while( --maxIterations ) {
		const tempReal      = real * real - imaginary * imaginary + x;
		const tempImaginary = 2 * real * imaginary + y;

		if( maxRadius < tempReal * tempImaginary ) {
			return maxIterations;
		}

		real      = tempReal;
		imaginary = tempImaginary;
	}

	return 0;
}

function drawFrame( timestamp, delta ) {
	const MAX_ITERATIONS = 5;
	const SCALE          = 3;
	const SCALE_DIV2     = SCALE / 2;
	const SCALE_DIV4     = SCALE / 4;
	const CENTER_X       = WIDTH / 2;
	const CENTER_Y       = HEIGHT / 2;
	const ROT_IN_TIME    = 6 * 1000;

	let rotation   = 0;
	let iterations = MAX_ITERATIONS;
	if( timestamp < ROT_IN_TIME ) {
		const inTime = Math.min( 0, ( timestamp - ROT_IN_TIME ) / ROT_IN_TIME );
		rotation = ( ( inTime - 1 ) * inTime * inTime ) * ROT_IN_TIME / 10000;
	}
	iterations = iterations + Math.floor( ( timestamp ) / 1000 );
	if( 20 < iterations ) {
		iterations = Math.min( 3000, Math.floor( iterations * ( iterations / 10 ) ) );
	}

	let y = -1;
	for( let mapIndex = 0, x = 0; mapIndex < WIDTH * HEIGHT * 4; mapIndex += 4, ++x ) {
		if( x === WIDTH ) {
			x = 0;
		}
		if( x === 0 ) {
			++y;
		}

		const sin = Math.sin( rotation );
		const cos = Math.cos( rotation );

		const real      = ( ( x - CENTER_X ) * cos - ( y - CENTER_Y ) * sin ) / WIDTH;
		const imaginary = ( ( x - CENTER_X ) * sin + ( y - CENTER_Y ) * cos ) / HEIGHT;

		const r = fractal(
				( real + 0.5 ) * SCALE - SCALE_DIV2 - SCALE_DIV4,
				( imaginary + 0.5 ) * SCALE - SCALE_DIV2,
				iterations,
				Math.min( Math.log( ( timestamp + 2000 ) / 3000 ), 10 )
			) / iterations * 255;

		const componentRed   = r;
		const componentGreen = r;
		const componentBlue  = r;

		pixMap.data[ mapIndex + 0 ] = componentRed;
		pixMap.data[ mapIndex + 1 ] = componentGreen;
		pixMap.data[ mapIndex + 2 ] = componentBlue;
		pixMap.data[ mapIndex + 3 ] = 255;
	}

	context.putImageData( pixMap, 0, 0 );
	context.font = "12px sans-serif";
	context.fillText( `${iterations}`, 2, 14 );
}

let previousTimestamp = 0;
function main( timestamp = 0 ) {
	window.requestAnimationFrame( main );

	const timeDelta = timestamp - previousTimestamp;
	drawFrame( timestamp, timeDelta );

	previousTimestamp = timestamp;
}

main();
