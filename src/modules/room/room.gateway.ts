import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from "@nestjs/websockets";
import { WSDefaultExceptionFilter } from "../../filters/wsDefaultException.filter";
import { WSRequestExceptionFilter } from "../../filters/wsRequestException.filter";
import { UseFilters } from "@nestjs/common";
import * as SocketIO from "socket.io";
import { VSocketAuthenticate } from "./room.validation";
import { ISocketPayload } from "./room.interface";
import { DAuthenticatedUser } from "../user/user.dto";
import { Socket } from "socket.io";
import { IUserJWT, UserService } from "../user/user.service";
import { RoomService } from "./room.service";
import { Message } from "../message/message.entity";
import { MessageService } from "../message/message.service";

@WebSocketGateway({transports: ['polling', 'websocket']})
@UseFilters(new WSRequestExceptionFilter(), new WSDefaultExceptionFilter())
export class RoomGateway implements OnGatewayInit, OnGatewayConnection {

  @WebSocketServer() server: SocketIO.Server;

  constructor(private userService: UserService,
              private messageService: MessageService,
              private roomService: RoomService) {

  }

  afterInit(server: any): any {
    console.log('Socket after init');
  }

  handleConnection(client: any, ...args: any[]): any {
  }

  @SubscribeMessage('message')
  async onMessage(@MessageBody() data: Message, @ConnectedSocket() client: ISocket): Promise<string> {

    let error;
    let message;
    try {
      data.author = client.user._id;
      message = await this.messageService.createMessage(data);
      this.server.to(data.roomId).emit('message', message);
    } catch (e) {
      console.log('Message send error: ', e);
      error = e;
    }

    this.roomService.sendNotificationToRoom(message.roomId, message);

    const response = error ? {error} : {message};
    return JSON.stringify(response);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: ISocket): Promise<string> {

    let error;
    let room = data.roomId;

    await new Promise((resolve, reject) => {
      client.join(data.roomId, (err) => {
        if (err) {
          error = err;
          resolve();
        }
        resolve();
      });
    });
    const response = error ? {error} : {room};
    return JSON.stringify(response);
  }

  @SubscribeMessage('authenticate')
  async onAuthenticateEvent(@MessageBody() data: { accessToken: string }, @ConnectedSocket() client: ISocket): Promise<string> {

    let error;
    let user;

    try {
      user = this.userService.verifyAuthToken(data.accessToken);
    } catch (e) {
      error = e;
      console.log('Invalid authentication token');
    }

    this.roomService.joinClientToRooms(client, user._id);

    const response: any = {};
    client.user = user;

    if (error) {
      response.error = error;
    } else {
      response.user = user;
    }

    return JSON.stringify(response);
  }

}

export interface ISocket extends SocketIO.Socket {
  user?: IUserJWT;
}
