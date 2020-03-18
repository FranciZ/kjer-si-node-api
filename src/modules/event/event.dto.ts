import { Event } from './event.entity';

export class DEvent {

  _id: string;
  numSeats: number;
  title: string;
  description: string;
  dateTime: string;

  constructor(eventDoc: Event) {
    this._id = eventDoc._id;
    this.numSeats = eventDoc.numSeats;
    this.title = eventDoc.title;
    this.description = eventDoc.description;
    this.dateTime = eventDoc.dateTime;
  }
}
