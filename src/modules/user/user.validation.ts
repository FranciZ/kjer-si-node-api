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

export class VUserLogin {
  @IsDefined() @IsString()
  password: string;
  @IsDefined() @IsEmail() @NormalizeEmail() @Trim()
  email: string;
}

export class VFirebaseUpdate {
  @IsDefined() @IsString()
  firebaseToken: string;
}

export class VRegister {
  @IsDefined() @IsString()
  uid: string;

  @Allow() @IsString()
  firebaseToken: string;
  @Allow() @IsString()
  nickname: string;
  @Allow() @IsString()
  name: string;
  @Allow() @IsString() @Length(6)
  password: string;
  @Allow() @IsEmail() @NormalizeEmail() @Trim()
  email: string;
}

export class VUserUpdate {

  @IsDefined() @IsString()
  name: string;
  @Allow() @IsEmail() @NormalizeEmail() @Trim()
  email: string;
  @Allow()
  avatar: File;

}
