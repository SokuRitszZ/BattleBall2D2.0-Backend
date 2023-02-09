import express from "express";

const server = express();

const router = express.Router();

server.get("/", async (req, res) => {
  res.end("Hello NodeJS Express");
});

server.listen(8080, async () => {
  console.log(`server listen at port ${8080}`);
});