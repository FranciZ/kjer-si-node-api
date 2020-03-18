import { prop, Typegoose, arrayProp, index, Ref } from '@hasezoey/typegoose';
import { Allow } from "class-validator";
import { File } from "../file/file.entity";
import { User } from "../user/user.entity";

export enum MessageType {
  TEXT = 'TEXT'
}

export class Message extends Typegoose {

  _id: string;

  @prop()
  text: string;

  @prop({ref: User})
  author?: Ref<User>;

  @prop({enum: MessageType})
  type: MessageType;

  @prop()
  roomId: string;

  @prop({default: () => new Date()})
  createdAt?: Date;

}

new Message().getModelForClass(Message);
