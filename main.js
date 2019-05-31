"use strict";

const nodeCanvas = document.getElementById("main");
const context = nodeCanvas.getContext("2d");

const width = nodeCanvas.width;
const height = nodeCanvas.height;

const pixMap = context.createImageData(width, height);

let y = 0;
for (let mapIndex = 0; mapIndex < width * height * 4; mapIndex += 4) {
  const x = mapIndex % width;
  if (x === 0) {
    ++y;
  }

  const nothing = 0;
  const componentRed = mapIndex % 256;
  const componentGreen = x % 256;
  const componentBlue = y % 256;

  pixMap.data[mapIndex + 0] = componentRed;
  pixMap.data[mapIndex + 1] = componentGreen;
  pixMap.data[mapIndex + 2] = componentBlue;
  pixMap.data[mapIndex + 3] = 255;
}

context.putImageData(pixMap, 0, 0);