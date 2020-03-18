import { prop, Typegoose, arrayProp, index, Ref } from '@hasezoey/typegoose';
import { RoomCategory } from "./room.enum";
import { User } from "../user/user.entity";

@index({geo: '2dsphere'})
export class Room extends Typegoose {

  _id: string;

  @prop()
  name?: string;

  @prop()
  description?: string;

  @prop()
  category_id?: RoomCategory;

  @prop()
  lat?: number;

  @prop()
  lng?: number;

  @prop({ref: User})
  author?: Ref<User>;

  @prop()
  radius?: number;

  @arrayProp({items: String})
  members?: Array<string>;

  @arrayProp({items: Number})
  geo: Array<Number>;

  @prop({default: () => new Date()})
  createdAt?: Date;

}

new Room().getModelForClass(Room);
