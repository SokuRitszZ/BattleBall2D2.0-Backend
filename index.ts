import express, { Express } from "express";
import initController from "./controllers";
import initMW from "./mw";
import { PORT, mode } from "./config.json";
const { initWS } = require("./websocket");

const server = express();

init(server);

function init(server: Express) {
  // 一定要先加载中间件
  initMW(server);
  // 然后才加载路由
  initController(server);
  // ws 
  initWS();
  
  server.listen(PORT[mode], async () => {
    console.log(`server listen at port ${PORT[mode]}...`);
  });
}


export default server;
