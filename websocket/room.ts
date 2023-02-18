import { send } from '.';
import { typeSocket } from './SocketServer';

export let mapId2Room: {
  [key: string]: typeRoom;
} = {};

export function broadCast(idRoom: string, event: string, data: any) {
  const room = mapId2Room[idRoom];
  if (!room) return;
  mapId2Room[idRoom].sockets.forEach((m) => send(m.conn, event, data));
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
    };

  mapId2Room[id].sockets = sockets;
  socket.idRoom = id;

  broadCast(id, 'game:join', { id, room: packRoom(sockets) });
}

export function packRoom(room: typeSocket[]) {
  return room.map((r) => r.user);
}

export function exitRoom(socket: typeSocket) {
  if (socket.idRoom) {
    const room = mapId2Room[socket.idRoom];
    if (!room) return;
    let sockets = room.sockets || [];

    broadCast(socket.idRoom, 'game:exit', {
      id: socket.idRoom,
      idUser: socket.user.id,
    });
    sockets = sockets.filter((s) => socket !== s);
    mapId2Room[socket.idRoom].sockets = sockets;
    if (!sockets.length) delete mapId2Room[socket.idRoom];

    socket.idRoom = '';
  }
}

export function getAvailableRoomKeys() {
  let keys = Object.keys(mapId2Room);
  keys = keys.filter(isValidRoom);
  return keys;
}

export function isValidRoom(idRoom: string) {
  return (
    !mapId2Room[idRoom] ||
    (!mapId2Room[idRoom].using && mapId2Room[idRoom].sockets.length < 5)
  );
}

export type typeRoom = {
  cnt: number;
  using: boolean;
  sockets: typeSocket[];
};
