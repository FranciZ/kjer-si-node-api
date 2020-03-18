import { prop, Typegoose, ModelType, InstanceType, arrayProp } from '@hasezoey/typegoose';
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

export enum FileType {
  IMAGE = 'IMAGE',
  GIF = 'GIF'
}

export class File extends Typegoose {

  _id: string;
  @prop()
  remote?: string;
  @prop()
  thumbRemote?: string;
  @prop()
  url?: string;
  @prop()
  thumbUrl?: string;
  @prop()
  mimeType?: string;
  @prop()
  size?: number;
  @prop({ enum: FileType })
  type?: FileType;
  @prop()
  width?: number;
  @prop()
  height?: number;

}

new File().getModelForClass(File);
