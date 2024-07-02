import { Socket } from "socket.io";

export interface global {}
declare global {
  var onlineUsers: Map<string, any>;
  var chatSocket: Socket;
}
