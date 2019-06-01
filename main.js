"use strict";

const nodeCanvas = document.getElementById( "main" );
const context    = nodeCanvas.getContext( "2d" );

const WIDTH            = nodeCanvas.width;
const HEIGHT           = nodeCanvas.height;
const ITERATION_LIMIT  = 30;
const MAX_ITERATIONS   = 15;
const SCALE            = 3;
const SCALE_DIV2       = SCALE / 2;
const SCALE_DIV4       = SCALE / 4;
const CENTER_X         = WIDTH / 2;
const CENTER_Y         = HEIGHT / 2;
const ROT_IN_TIME      = 15 * 1000;
const ROT_IN_TIME_DIV2 = ROT_IN_TIME / 2;

const pixMap = context.createImageData( WIDTH, HEIGHT );

const PALETTE = [ 0x3a242b, 0x3b2426, 0x352325, 0x836454, 0x7d5533, 0x8b7352, 0xb1a181, 0xa4632e, 0xbb6b33, 0xb47249, 0xca7239, 0xd29057, 0xe0b87e, 0xd9b166, 0xf5eabe, 0xfcfadf, 0xd9d1b0, 0xfcfadf, 0xd1d1ca, 0xa7b1ac, 0x879a8c, 0x9186ad, 0x776a8e, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022, 0x000022 ].reverse();

function fractal( x, y, maxIterations, maxRadius ) {
	let real      = x;
	let imaginary = y;

	while( --maxIterations ) {
		const tempReal      = real * real - imaginary * imaginary + x;
		const tempImaginary = 2 * real * imaginary + y;
		const radius        = tempReal * tempImaginary;

		if( maxRadius < radius ) {
			return maxIterations;
		}

		real      = tempReal;
		imaginary = tempImaginary;
	}

	return 0;
}

function drawFrame( timestamp, delta ) {
	const bg = Math.max( 0, ( ( timestamp - ROT_IN_TIME_DIV2 ) / ROT_IN_TIME * 255 ) );
	document.body.style.background = `rgb(${bg},${bg},${bg})`;

	let rotation   = 0;
	let iterations = MAX_ITERATIONS;
	if( timestamp < ROT_IN_TIME ) {
		const inTime = Math.min( 0, ( timestamp - ROT_IN_TIME ) / ROT_IN_TIME );
		rotation = ( ( inTime - 1 ) * inTime * inTime ) * ROT_IN_TIME / 10000;
	} else {
		iterations = iterations + Math.floor( ( timestamp - ROT_IN_TIME ) / 400 );
		iterations = Math.min( ITERATION_LIMIT, iterations );
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

		const real      = ( ( x - CENTER_X ) * cos - ( y - CENTER_Y ) * sin ) / WIDTH + 0.5;
		const imaginary = ( ( x - CENTER_X ) * sin + ( y - CENTER_Y ) * cos ) / HEIGHT + 0.5;

		const r = fractal(
				real * SCALE - SCALE_DIV2 - SCALE_DIV4,
				( imaginary + Math.sin( x / 100 ) * rotation * 0.15 ) * SCALE - SCALE_DIV2,
				iterations,
				Math.min( Math.log( ( timestamp  ) / 10000 ), WIDTH )
			) / iterations * 255;

		const color = PALETTE[ Math.floor( r / 255 * PALETTE.length ) ];
		const fade  = Math.max( 0, ( ( ROT_IN_TIME_DIV2 - timestamp ) / ROT_IN_TIME_DIV2 * 255 ) );

		const componentRed   = color >> 16 & 0xff;
		const componentGreen = color >> 8 & 0xff;
		const componentBlue  = color & 0xff;

		pixMap.data[ mapIndex + 0 ] = componentRed - fade;
		pixMap.data[ mapIndex + 1 ] = componentGreen - fade;
		pixMap.data[ mapIndex + 2 ] = componentBlue - fade;
		pixMap.data[ mapIndex + 3 ] = 255;
	}

	context.putImageData( pixMap, 0, 0 );
	context.font = "12px sans-serif";
	context.fillText( `${iterations}`, 2, 14 );

	return iterations <= ITERATION_LIMIT;
}

let previousTimestamp = 0;
function main( timestamp = 0 ) {
	const timeDelta = timestamp - previousTimestamp;
	if( drawFrame( timestamp, timeDelta ) ) {
		window.requestAnimationFrame( main );
	}

	previousTimestamp = timestamp;
}

main();
