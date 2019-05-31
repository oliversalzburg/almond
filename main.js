"use strict";

const nodeCanvas = document.getElementById( "main" );
const context    = nodeCanvas.getContext( "2d" );

const width  = nodeCanvas.width;
const height = nodeCanvas.height;

const pixMap = context.createImageData( width, height );

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
	let y = -1;

	for( let mapIndex = 0, x = 0; mapIndex < width * height * 4; mapIndex += 4, ++x ) {
		if( x === width ) {
			x = 0;
		}
		if( x === 0 ) {
			++y;
		}

		const real      = x / width;
		const imaginary = y / height;

		const r = fractal( ( real * 2 ) - 1.5, ( imaginary * 2 ) - 1, 255, 50 );

		const componentRed   = r;
		const componentGreen = r;
		const componentBlue  = r;

		pixMap.data[ mapIndex + 0 ] = componentRed;
		pixMap.data[ mapIndex + 1 ] = componentGreen;
		pixMap.data[ mapIndex + 2 ] = componentBlue;
		pixMap.data[ mapIndex + 3 ] = 255;
	}

	context.putImageData( pixMap, 0, 0 );
}

let previousTimestamp = 0;
function main( timestamp = 0 ) {
	window.requestAnimationFrame( main );

	const timeDelta = timestamp - previousTimestamp;
	drawFrame( timestamp, timeDelta );

	previousTimestamp = timestamp;
}

main();
