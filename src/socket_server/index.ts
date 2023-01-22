import { WebSocketServer } from 'ws';

import { ERROR_MESSAGES } from './../constants';
import motionService from '../services/motion.service';
import { parseCommand } from '../helpers/get-args';
import { replaceSpaces } from '../helpers/replace-spaces';

const listen = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('connection');

    ws.on('message', async (message) => {
      const stringifiedMessage = message.toString();
      let wsResponse = replaceSpaces(stringifiedMessage);

      console.log(`Received message => ${stringifiedMessage}`);

      const { commandName, coordinates } = parseCommand(stringifiedMessage);

      switch (commandName) {
        case 'mouse_up':
          await motionService.moveMouse(0, -coordinates[0]);
          break;
        case 'mouse_down':
          await motionService.moveMouse(0, coordinates[0]);
          break;
        case 'mouse_left':
          await motionService.moveMouse(-coordinates[0], 0);
          break;
        case 'mouse_right':
          await motionService.moveMouse(coordinates[0], 0);
          break;
        case 'mouse_position':
          const { x, y } = await motionService.getMousePosition();
          wsResponse = replaceSpaces(`${commandName} ${x},${y}`);
          break;
        case 'draw_circle':
          await motionService.drawCircle(coordinates[0]);
          break;
        case 'draw_rectangle':
          await motionService.drawRectangle(coordinates[0], coordinates[1]);
          break;
        case 'draw_square':
          await motionService.drawRectangle(coordinates[0], coordinates[0]);
          break;
        case 'prnt_scrn':
          try {
            const image = await motionService.printScreen();
            wsResponse = `${commandName} ${image}`;
          } catch (error) {
            if ((error as any).message) {
              wsResponse = replaceSpaces((error as any).message);
            } else {
              wsResponse = replaceSpaces(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
            }
          }
          break;
        default:
          ws.send(replaceSpaces(ERROR_MESSAGES.COMMAND_NOT_FOUND));
          break;
      }

      ws.send(wsResponse);
    });
  });
};

export default { listen };
