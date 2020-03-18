import { Room } from './room.entity';

export class DRoom {

  _id: string;
  name: string;
  category_id: string;
  memberCount: number;
  lat: number;
  lng: number;
  eventCount: number;
  amMember: boolean;
  description: string;

  constructor(roomDoc: Room) {
    this._id = roomDoc._id;
    this.name = roomDoc.name;
    this.category_id = roomDoc.category_id;
    this.memberCount = roomDoc.members.length;
    this.lat = roomDoc.lat;
    this.lng = roomDoc.lng;
    this.description = roomDoc.description;
  }
}
