import { NormalizeEmail, Trim } from 'class-sanitizer';
import { User } from '../user/user.entity';
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
  ValidateNested,
  Length,
  IsEmail
} from 'class-validator';
import { File } from '../file/file.entity';

export class VCreateTeam {

  @IsDefined() @IsString()
  name: string;

  @Allow()
  image: File;

}

export class VUpdateTeam {

  @IsDefined() @IsString()
  name: string;

  @Allow()
  image: File;

}
