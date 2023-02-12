import jwt from "jsonwebtoken";
import User from "../model/user/db";
import ChatService from "./service/ChatService";
import { send } from ".";
import GameService from "./service/GameService";
import { exitRoom } from "./room";

export let sockets: typeSocket[] = [];

export function broadCastAll(event: string, data: any) {
  sockets.forEach(s => send(s.conn, event, data));
}

export default async function createSocketServer(conn: any, token: string) {
  const dataJwt = jwt.decode(token) as any;

  const user = await User.findOne({
    where: { id: dataJwt.id },
    attributes: ["id", "name", "avatar"],
  });

  if (!user) return conn.close();

  const socket: typeSocket = {
    conn,
    user: user.toJSON(),
  };
  sockets.push(socket);

  conn.on("text", (msg: string) => {
    const { event, data } = JSON.parse(msg) as typeMessage;
    const paths = event.split(":");
    if (!paths.length) return;
    switch (paths[0]) {
      case "chat": {
        ChatService(socket, paths.slice(1), data);
      }
      break;
      case "game": {
        GameService(socket, paths.slice(1), data);
      };
      break;
    }
  });

  conn.on("close", () => {
    exitRoom(socket);
    sockets = sockets.filter((s) => s !== socket);
  });
}

export type typeSocket = {
  idRoom?: string;
  conn: any;
  user: {
    id: string;
    name: string;
    avatar: string;
    ok: boolean;
    position?: {
      x: number;
      y: number;
    },
  };
};

export type typeMessage = {
  event: string;
  data: any;
};
