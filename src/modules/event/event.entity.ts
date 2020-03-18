import { prop, Typegoose, arrayProp, index, Ref } from '@hasezoey/typegoose';
import { User } from "../user/user.entity";
import { Room } from "../room/room.entity";

export class Event extends Typegoose {

  _id: string;

  @prop()
  title: string;

  @prop()
  description: string;

  @prop({default: false})
  limitedSeats: boolean;

  @prop()
  numSeats: number;

  @prop({ref: User})
  author?: Ref<User>;

  @prop({ref: Room})
  room?: Ref<Room>;

  @arrayProp({itemsRef: User})
  members?: Array<User | string>;

  @prop()
  dateTime: string;

  @prop({default: () => new Date()})
  createdAt?: Date;

}

new Event().getModelForClass(Event);
