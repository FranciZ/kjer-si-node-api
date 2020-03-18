import { Injectable } from '@nestjs/common';
import { Room } from "./room.entity";
import { VRoom } from "./room.validation";
import { User } from "../user/user.entity";
import { Event } from "../event/event.entity";
import { DRoom } from "./room.dto";
import { Socket } from "socket.io";
import { Message } from "../message/message.entity";
import * as admin from "firebase-admin";
import { RoomCategory } from "./room.enum";


@Injectable()
export class RoomService {

  getRoomCategories() {
    return [
      {
        id: RoomCategory.NEIGHBOUR_ASSISTANCE
      },
      {
        id: RoomCategory.ANIMALS
      },
      {
        id: RoomCategory.RECREATION
      }
    ];
  }

  public async createRoom(user: User, roomData: VRoom) {

    const RoomModel = new Room().getModelForClass(Room);
    const room = new RoomModel(roomData);
    room.author = user._id;
    room.members = [user._id];
    room.geo = [room.lng, room.lat];
    const savedRoom = await room.save();
    return new DRoom(savedRoom);

  }

  public async joinRoom(userId: string, roomId: string) {
    const RoomModel = new Room().getModelForClass(Room);
    await RoomModel.update({_id: roomId}, {$addToSet: {members: userId}});
    return {
      roomId
    };
  }

  public async getRoomMessages(roomId: string, beforeDate: string) {
    const MessageModel = new Message().getModelForClass(Message);
    const query: any = {roomId};
    if (beforeDate) {
      query.createdAt = {$lt: beforeDate};
    }
    const messages: Array<Message> = await MessageModel.find(query).sort('-createdAt').populate('author', 'nickname').limit(20);
    return messages.reverse();
  }

  public async leaveRoom(userId: string, roomId: string) {
    const RoomModel = new Room().getModelForClass(Room);
    await RoomModel.update({_id: roomId}, {$pull: {members: userId}});
    return {
      roomId
    };
  }

  public async joinClientToRooms(client: Socket, userId: string) {
    const RoomModel = new Room().getModelForClass(Room);
    const rooms: Array<Room> = await RoomModel.find({members: userId}).select('_id');
    const roomIds = rooms.map(r => r._id);

    roomIds.forEach((roomId) => {
      client.join(roomId);
    });
  }

  public async sendNotificationToRoom(roomId: string, message: Message) {

    const RoomModel = new Room().getModelForClass(Room);

    let msg: any = {
      android: {
        priority: 'high',
        notification: {
          sound: 'notification'
        }
      },
      apns: {
        payload: {
          aps: {
            alert: {},
            badge: 1
          }
        }
      },
      topic: String(roomId),
      data: {roomId}
    };

    const room: Room = await RoomModel.findOne({_id: roomId});
    let title = 'Novo sporočilo';

    if (room.category_id === RoomCategory.RECREATION) {
      title += ' iz sobe rekreacija 💪';
    } else if (room.category_id === RoomCategory.ANIMALS) {
      title += ' iz sobe živali 🦮';
    } else if (room.category_id === RoomCategory.NEIGHBOUR_ASSISTANCE) {
      title += ' iz sobe soseska pomoč 🙋';
    }

    msg.android.notification.title = title;
    msg.android.notification.body = message.text;
    msg.apns.payload.aps.alert.title = title;
    msg.apns.payload.aps.alert.body = message.text;

    admin.messaging().send(msg)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  public async findRoomsInRadius(lat: number, lng: number, userId: string) {
    const RoomModel = new Room().getModelForClass(Room);
    const rooms: Array<Room> = await RoomModel.find({
      geo: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: 6000
        }
      }
    });

    const EventModel = new Event().getModelForClass(Event);
    const roomIds = rooms.map(r => r._id);
    const events = await EventModel.find({room: {$in: roomIds}}).select('dateTime room');

    return rooms.map(r => {
      const room = new DRoom(r);
      room.amMember = !!r.members.filter(memberId => String(memberId) === String(userId)).length;
      room.eventCount = events.filter(e => String(e.room) === String(r._id) && new Date(e.dateTime) > new Date()).length;
      return room;
    });
  }

}
