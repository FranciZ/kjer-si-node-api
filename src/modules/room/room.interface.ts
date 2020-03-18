import { User } from "../user/user.entity";
import * as SocketIO from "socket.io";

export interface ISocketPayload extends SocketIO.Socket {
  user: User;
}
