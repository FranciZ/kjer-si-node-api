import { prop, Typegoose, ModelType, InstanceType, arrayProp, Ref } from '@hasezoey/typegoose';
import { File } from '../file/file.entity';
import * as mongoose from 'mongoose';
import {
  Allow,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsInt,
  IsString,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';

/**
 * This is the dashboard and builder user
 * for game players check the player module or entity
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class User extends Typegoose {

  _id: string;

  @prop()
  uid?: string;

  @prop()
  nickname?: string;

  @prop()
  firebaseToken?: string;

  @prop()
  email: string;

  @prop()
  password?: string;

  @prop({ref: File})
  profile?: Ref<File>;

  @prop({enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @prop({default: () => new Date()})
  createdAt?: Date;

}

export enum TeamUserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export class TeamMember extends Typegoose {

  _id: string;

  @prop({ref: User})
  user: Ref<User>;

  @prop({default: () => new Date()})
  timeCreated?: Date;

  @prop({enum: TeamUserRole})
  role?: TeamUserRole;

}

export class Team extends Typegoose {

  _id: string;

  @prop({default: () => new Date()})
  timeCreated?: Date;

  @Allow()
  @IsString()
  @prop()
  name?: string;

  @Allow()
  @IsString()
  @prop()
  about?: string;

  @Allow()
  @prop({ref: File})
  image?: Ref<File>;

  @prop({default: false})
  deleted?: boolean;

  @arrayProp({items: TeamMember})
  members: TeamMember[];

}

new User().getModelForClass(User);
