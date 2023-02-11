import jwt from "jsonwebtoken";
import User, { typeUser } from "../model/user/db";
import ChatService from "./ChatService";
import { send } from ".";

export let sockets: typeSocket[] = [];
export let mapId2Room: { [key: string]: typeRoom } = {};

export function broadCast(idRoom: string, event: string, data: any) {
  mapId2Room[idRoom].forEach(m => send(m.conn, event, data));
}

export function broadCastAll(event: string, data: any) {
  sockets.forEach(s => send(s.conn, event, data));
}

export function joinRoom(socket: typeSocket, id: string) {
  exitRoom(socket);
  const room: typeRoom = mapId2Room[id] || [];
  room.push(socket);
  mapId2Room[id] = room;
}

export function exitRoom(socket: typeSocket) {
  if (socket.idRoom) {
    const members = mapId2Room[socket.idRoom] || [];
    mapId2Room[socket.idRoom] = members.filter(s => socket !== s);
    socket.idRoom = "";
  }
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
      case "chat":
        {
          ChatService(socket, paths.slice(1), data);
        }
        break;
    }
  });

  conn.on("close", () => {
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
  };
};

export type typeMessage = {
  event: string;
  data: any;
};

export type typeRoom = typeSocket[];