import cors from "cors";
import { Express } from "express";
import bodyParser from "./bodyParser";
import useJwt, { useJwtAuth } from "./jwt";

function initMW(server: Express) {
  server.use(cors());
  server.use(...bodyParser());
  server.use(useJwt(), useJwtAuth());
}

export default initMW;
