import cors from "cors";
import { Express } from "express";
import bodyParser from "./bodyParser";
import useJwt, { useJwtAuth } from "./jwt";
import useStatic from './static';

function initMW(server: Express) {
  server.use(cors());
  server.use(...bodyParser());
  server.use("/api", useJwt(), useJwtAuth()); // "/api"
  server.use(useStatic());
}

export default initMW;
