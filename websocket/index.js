const ws = require("nodejs-websocket");
import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../config.json";


function initWS() {
  console.log("WebSocket server listen at port 3000...");
  const server = ws
    .createServer((conn) => {
      const [_, token] = conn.path.split("/");
      console.log("New Connection");
      try {
        jwt.verify(token, JWT_SECRETKEY);
        conn.on("text", (str) => {
          console.log(`Received ${str}`);
          send(conn, {
            event: "msg",
            data: {
              msg: `Received ${str}`,
            },
          });
        });
        conn.on("error", (err) => {});
        conn.on("close", (code, reason) => {
          console.log("Connection closed");
        });
      } catch (e) {
        send(conn, {
          event: "msg",
          data: {
            msg: "Invalid Token.",
          },
        });
        conn.close();
      }
    })
    .listen(3000);

  return server;
}

function send(conn, data) {
  conn.sendText(JSON.stringify(data));
}

module.exports = {
  initWS,
  send,
};
