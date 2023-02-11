import { nanoid } from "nanoid";
import { broadCastAll, typeSocket } from "./SocketServer";

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
    };
    break;
    case "join": {
      data = {
        join: true,
        sender: socket.user,
      };
      broadCastAll("chat:join", data);
    };
    break;
    case "exit": {
      data = {
        exit: true,
        sender: socket.user,
      };
      broadCastAll("chat:exit", data);
    }
  }
}

export default ChatService;