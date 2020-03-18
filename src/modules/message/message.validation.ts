import {
  IsDefined,
  IsString,
  IsNumber
} from 'class-validator';

export class VMessage {

  @IsDefined() @IsString()
  name: string;
  @IsDefined() @IsString()
  category_id: string;
  @IsDefined() @IsNumber()
  lat: number;
  @IsDefined() @IsNumber()
  lng: number;
  @IsDefined() @IsNumber()
  radius: number;

}
