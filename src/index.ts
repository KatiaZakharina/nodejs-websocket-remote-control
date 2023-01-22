import { MESSAGES } from './constants';
import { httpServer } from './http_server/index';
import socketServer from './socket_server/index';
import 'dotenv/config';

const httpPort = Number(process.env.HTTP_PORT) || 3001;
const socketPort = Number(process.env.SOCKET_PORT) || 3002;

httpServer.listen(httpPort);
console.log(`Start static http server on the ${httpPort} port!`);

const wss = socketServer.listen(socketPort);
console.log(`Start websocket server on the ${socketPort} port!`);

process.on('SIGINT', () => {
  wss.close();
  httpServer.close();

  console.log(MESSAGES.CONNECTION_CLOSED);
});
