import { Message } from './message.entity';

export class DMessage {

  _id: string;
  name: string;
  category_id: string;
  memberCount: number;

  constructor(roomDoc: Message) {
    this._id = roomDoc._id;
    this.name = roomDoc.name;
    this.category_id = roomDoc.category_id;
    this.memberCount = roomDoc.members.length;
  }
}
