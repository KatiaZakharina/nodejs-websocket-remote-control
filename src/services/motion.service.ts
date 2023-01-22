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

const drawCircle = async (radius: number) => {
  const { x: currentX, y: currentY } = await getMousePosition();
  const offset = 3;

  const path = Array(360 / offset)
    .fill(0)
    .map((_, i) => {
      const angle = i * offset;
      const pointX = Math.cos((angle * Math.PI) / 180) * radius;
      const pointY = Math.sin((angle * Math.PI) / 180) * radius;

      return {
        x: currentX - radius + pointX,
        y: currentY - pointY,
      };
    });
  path.push(path[0]);

  mouse.config.mouseSpeed = 80;
  mouse.drag(path);
};

const drawRectangle = async (width: number, height: number) => {
  const { x: currentX, y: currentY } = await getMousePosition();

  mouse.config.mouseSpeed = 30;
  mouse.drag([
    { x: currentX, y: currentY },
    { x: currentX + width, y: currentY },
    { x: currentX + width, y: currentY + height },
    { x: currentX, y: currentY + height },
    { x: currentX, y: currentY },
  ]);
};

const printScreen = async () => {
  const size = 200;
  const { x, y } = await getMousePosition();
  const capturingRegion = new Region(x, y, size, size);

  const screenshot = await screen.grabRegion(capturingRegion);
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
