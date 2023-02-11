import jwt from "jsonwebtoken";
import User, { typeUser } from "../model/user/db";
import ChatService from "./service/ChatService";
import { send } from ".";
import GameService from "./service/GameService";

export let sockets: typeSocket[] = [];
export let mapId2Room: { 
  [key: string]: typeRoom;
} = {};

export function broadCast(idRoom: string, event: string, data: any) {
  mapId2Room[idRoom].sockets.forEach(m => send(m.conn, event, data));
}

export function broadCastAll(event: string, data: any) {
  sockets.forEach(s => send(s.conn, event, data));
}

export function joinRoom(socket: typeSocket, id: string) {
  exitRoom(socket);

  if (!mapId2Room[id]) {
    mapId2Room[id] = {
      cnt: 0,
      using: false,
      sockets: [],
    };
  }
  const sockets = mapId2Room[id].sockets || [];
  sockets.push(socket);

  if (!mapId2Room[id]) 
    mapId2Room[id] = {
      cnt: 0,
      using: false,
      sockets: [],
    }
  
  mapId2Room[id].sockets = sockets;
  socket.idRoom = id;
  
  broadCast(id, "game:join", { id, room: packRoom(sockets) });
}

export function packRoom(room: typeSocket[]) {
  return room.map((r) => r.user);
}

export function exitRoom(socket: typeSocket) {
  if (socket.idRoom) {
    let sockets = mapId2Room[socket.idRoom].sockets || [];
    
    broadCast(socket.idRoom, "game:exit", {
      id: socket.idRoom,
      idUser: socket.user.id,
    });
    sockets = sockets.filter(s => socket !== s);
    mapId2Room[socket.idRoom].sockets = sockets;
    if (!sockets.length) delete mapId2Room[socket.idRoom];

    socket.idRoom = "";
  }
}

export function getAvailableRoomKeys() {
  let keys = Object.keys(mapId2Room);
  keys = keys.filter(isValidRoom);
  return keys;
}

export function isValidRoom(idRoom: string) {
  return !mapId2Room[idRoom] || !mapId2Room[idRoom].using && mapId2Room[idRoom].sockets.length < 5;
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

export type typeRoom = {
  cnt: number;
  using: boolean;
  sockets: typeSocket[];
}