import {
  IsDefined,
  IsString,
  IsNumber, IsBoolean
} from 'class-validator';

export class VEvent {

  @IsDefined() @IsString()
  title: string;
  @IsDefined() @IsString()
  description: string;
  @IsDefined() @IsString()
  dateTime: string;
  @IsDefined() @IsNumber()
  numSeats: number;
  @IsDefined() @IsBoolean()
  limitedSeats: boolean;

}
