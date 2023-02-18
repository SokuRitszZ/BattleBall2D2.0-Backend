import { nanoid } from 'nanoid';
import random from '../../utils/random';
import {
  broadCast,
  exitRoom,
  getAvailableRoomKeys,
  isValidRoom,
  joinRoom,
  mapId2Room,
  packRoom,
} from '../room';
import { typeSocket } from '../SocketServer';

function GameService(socket: typeSocket, paths: string[], data: any) {
  if (!paths.length) return;
  switch (paths[0]) {
    case 'join':
      {
        let { id } = data;
        join(socket, id);
      }
      break;
    case 'exit': {
      exitRoom(socket);
    }
    case 'ok':
      {
        someOneOk(socket);
      }
      break;
    case 'go':
      {
        const { position } = data;
        load(socket, position);
      }
      break;
    case 'act':
      {
        handleAct(socket, data);
      }
      break;
    case 'die': {
      someOneDie(socket);
    }
  }
}

function join(socket: typeSocket, id: string) {
  socket.user.ok = false;
  const keys = getAvailableRoomKeys();
  if (!id || !isValidRoom(id)) {
    if (!keys.length) {
      id = nanoid(8);
      while (!isValidRoom(id)) id = nanoid(8);
    } else id = random(keys);
  }
  joinRoom(socket, id);
}

function someOneOk(socket: typeSocket) {
  if (!socket.idRoom) return;
  socket.user.ok = !socket.user.ok;
  broadCast(socket.idRoom, 'game:ok', {
    id: socket.user.id,
    ok: socket.user.ok,
  });
  if (checkOk(socket.idRoom)) {
    startGame(socket.idRoom);
  }
}

function checkOk(idRoom: string) {
  const room = mapId2Room[idRoom];
  return (
    room.sockets.length > 1 &&
    room.sockets.filter((s) => !s.user.ok).length === 0
  );
}

function startGame(idRoom: string) {
  broadCast(idRoom, 'game:start', {});
  mapId2Room[idRoom].using = true;
}

function endGame(idRoom: string) {
  broadCast(idRoom, 'game:over', {});
  delete mapId2Room[idRoom];
}

function load(socket: typeSocket, position: { x: number; y: number }) {
  const idRoom = socket.idRoom;
  if (!idRoom) return;
  const room = mapId2Room[idRoom];
  if (!room) return;
  socket.user.position = position;
  ++room.cnt;
  if (room.cnt === room.sockets.length) {
    broadCast(idRoom, 'game:go', {
      positions: room.sockets.map((s) => s.user.position),
      users: packRoom(room.sockets),
    });
  }
}

function handleAct(socket: typeSocket, data: any) {
  const id = socket.idRoom;
  if (!id) return;
  broadCast(id, `game:act:${socket.user.id}`, data);
}

function someOneDie(socket: typeSocket) {
  if (!socket.idRoom) return;
  const room = mapId2Room[socket.idRoom];
  if (!room) return;
  --room.cnt;
  if (room.cnt <= 1) {
    endGame(socket.idRoom!);
  }
}

export default GameService;
