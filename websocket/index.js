const ws = require('nodejs-websocket');
import jwt from 'jsonwebtoken';
import { JWT_SECRETKEY } from '../config.json';
import createSocketServer from './SocketServer';

function initWS() {
  console.log('WebSocket server listen at port 3000...');
  const server = ws
    .createServer((conn) => {
      const [_, token] = conn.path.split('/');
      console.log('New Connection');
      try {
        jwt.verify(token, JWT_SECRETKEY);
        createSocketServer(conn, token);
        conn.on('error', (err) => {});
        conn.on('close', (code, reason) => {
          console.log('Connection closed');
        });
      } catch (e) {
        send(conn, {
          event: 'msg',
          data: {
            msg: 'Invalid Token.',
          },
        });
        conn.close();
      }
    })
    .listen(3000);

  return server;
}

function send(conn, event, data) {
  // console.log(event, data);
  conn.sendText(JSON.stringify({ event, data }));
}

module.exports = {
  initWS,
  send,
};

export { initWS, send };
