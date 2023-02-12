import { nanoid } from "nanoid";
import { send } from "..";
import { broadCastAll, typeSocket } from "../SocketServer";
import { MSG_MAX } from "../../config.json";

const msgs: any[] = [];

function addMsg(msgs: any[], msg: any) {
  while (msgs.length >= MSG_MAX) msgs.unshift();
  msgs.push(msg);
};

function ChatService(socket: typeSocket, paths: string[], data: any) {
  if (!paths.length) return ;
  switch (paths[0]) {
    case "new": {
      data = {
        id: nanoid(8),
        sender: socket.user,
        ...data,
      };
      broadCastAll("chat:new", data);
      addMsg(msgs, data);
    };
    break;
    case "join": {
      data = {
        join: true,
        sender: socket.user,
      };
      broadCastAll("chat:join", data);
      addMsg(msgs, data);
      send(socket.conn, "chat:load", {
        msgs,
      });
    };
    break;
    case "exit": {
      data = {
        exit: true,
        sender: socket.user,
      };
      broadCastAll("chat:exit", data);
      addMsg(msgs, data);
    }
  }
}

export default ChatService;