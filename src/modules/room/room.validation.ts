import {
  IsDefined,
  IsString,
  IsNumber, IsDate, Allow
} from 'class-validator';

export class VRoom {
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
  @Allow() @IsString()
  description: string;
}

export class VLocation {
  @IsDefined() @IsNumber()
  lat: number;
  @IsDefined() @IsNumber()
  lng: number;
}

export class VGetMessages {
  @Allow() @IsString()
  beforeDate: string;
}

export class VSocketAuthenticate {
  @IsString()
  token: string;
}
