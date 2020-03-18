import { Injectable } from '@nestjs/common';
import { Event } from "./event.entity";
import { VEvent } from "./event.validation";

@Injectable()
export class EventService {

  async createEvent(event: VEvent, roomId: string, userId: string) {

    const EventModel = new Event().getModelForClass(Event);
    const eventDocument = new EventModel(event);
    eventDocument.room = roomId;
    eventDocument.author = userId;
    eventDocument.save();
    await eventDocument.populate('author', 'nickname').execPopulate();
    return eventDocument;

  }

  async getEvents(roomId: string) {
    const EventModel = new Event().getModelForClass(Event);
    return EventModel.find({room: roomId}).sort('dateTime');
  }

}
