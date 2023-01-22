import { mouse, screen, Region } from '@nut-tree/nut-js';
import Jimp from 'jimp';

const getMousePosition = async () => {
  return await mouse.getPosition();
};

const moveMouse = async (x: number, y: number) => {
  const { x: currentX, y: currentY } = await getMousePosition();

  mouse.setPosition({
    x: currentX + x,
    y: currentY + y,
  });
};

const drawCircle = async (radius: number) => {};

const drawRectangle = async (width: number, height: number = width) => {};

const printScreen = async () => {
  const size = 200;
  const { x, y } = await getMousePosition();
  const region = new Region(x, y, size, size);

  const screenshot = await screen.grabRegion(region);
  const corrected = await screenshot.toRGB();

  const image = new Jimp(corrected);
  const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  return pngBuffer.toString('base64');
};

export default {
  moveMouse,
  getMousePosition,
  drawCircle,
  drawRectangle,
  printScreen,
};
