import { Injectable } from '@nestjs/common';
import { InvalidTokenException } from '../../exceptions/invalidToken.exception';
import * as jwt from 'jsonwebtoken';
import { VRegister, VUserLogin, VUserUpdate } from './user.validation';
import { DAuthenticatedUser } from './user.dto';
import { TeamMember, TeamUserRole, User } from './user.entity';
import { CryptUtil } from '../common/auth/crypt.util';
import { Team } from './user.entity';
import { InvalidLoginCredentialsException } from './exceptions/invalidLoginCredentials.exception';
import { EmailNotVerifiedException } from './exceptions/emailNotVerified.exception';
import { EmailExistsException } from './exceptions/emailExists.exception';
import * as fs from 'fs';

@Injectable()
export class UserService {

  private readonly jwtSecret: string = process.env.JWT_SECRET;

  public verifyAuthToken(token: string): IUserJWT {
    try {
      return jwt.verify(token, this.jwtSecret) as IUserJWT;
    } catch (err) {
      throw new InvalidTokenException();
    }
  }

  public async getUser(_id: string, populateAvatar = false): Promise<User> {
    const UserModel = new User().getModelForClass(User);
    if (!populateAvatar) {
      return await UserModel.findById(_id).select('-password');
    } else {
      return await UserModel.findById(_id).select('-password').populate('avatar');
    }
  }

  public async userBootstrap(user: User) {
    const TeamModel = new Team().getModelForClass(Team);
    const allTeams = await TeamModel.find({'members.user': user._id});

    const teams = allTeams.map((team) => {
      return {
        _id: team._id,
        name: team.name,
        role: team.members.filter(member => String(member.user) === String(user._id))[0].role
      };
    });

    return {
      userId: user._id,
      nickname: user.nickname,
      email: user.email,
      teams
    };

  }

  public async getRandomNickname(tryCount = 1) {

    if (tryCount > 50) {
      throw new Error(`Couldn't find random nickname in 50 tries`);
    }

    const firstPartArray = fs.readFileSync('src/assets/nickname/first.txt').toString().split("\n");
    const secondPartArray = fs.readFileSync('src/assets/nickname/second.txt').toString().split("\n");

    const randomFirstPart = firstPartArray[Math.floor(Math.random() * firstPartArray.length)];
    const randomSecondPart = secondPartArray[Math.floor(Math.random() * secondPartArray.length)];

    const nickname = randomFirstPart + randomSecondPart;
    const nicknameExists = await this.findUserByNickname(nickname);

    if (nicknameExists) {
      return this.getRandomNickname(tryCount++);
    }

    return nickname;

  }

  private async findUserByNickname(nickname): Promise<boolean> {

    const UserModel = new User().getModelForClass(User);
    return !!(await UserModel.count({nickname}));
  }

  public async updateFirebaseToken(userId: string, firebaseToken: string): Promise<string> {
    const UserModel = new User().getModelForClass(User);
    await UserModel.findOneAndUpdate({_id: userId}, {firebaseToken});
    return 'success';
  }

  public async register(userData: VRegister): Promise<DAuthenticatedUser> {

    const existingUser = await this.getByUid(userData.uid);
    if (existingUser) {
      return new DAuthenticatedUser(existingUser, CryptUtil.generateToken(existingUser, this.jwtSecret));
    }

    console.log('userData: ', userData);

    const UserModel = new User().getModelForClass(User);
    // userData.password = await CryptUtil.generateHash(userData.password);
    const user = new UserModel(userData);
    user.nickname = await this.getRandomNickname();
    console.log('user.nickname:', user.nickname);
    await user.save();

    // await this.sendEmailVerification(user.unverifiedEmail);

    return new DAuthenticatedUser(user, CryptUtil.generateToken(user, this.jwtSecret));

  }

  public async login(data: VUserLogin): Promise<DAuthenticatedUser> {

    const UserModel = new User().getModelForClass(User);
    const user = await UserModel.findOne({email: data.email});

    if (!user || !user.password) throw new InvalidLoginCredentialsException();
    if (user.email !== data.email) throw new EmailNotVerifiedException();

    const match = await CryptUtil.compare(data.password, user.password);

    if (!match) throw new InvalidLoginCredentialsException();

    return new DAuthenticatedUser(user, CryptUtil.generateToken(user, this.jwtSecret));

  }

  public async updateUser(userId: string, data: VUserUpdate) {
    const UserModel = new User().getModelForClass(User);
    const oldUser = await UserModel.findById(userId);
    if (oldUser.email !== data.email) {
      const emailExists = !!(await UserModel.findOne({email: data.email}));
      if (emailExists) throw new EmailExistsException(data.email);
    }
    return await UserModel.findByIdAndUpdate(userId, data, {new: true}).populate('avatar');
  }

  public async getByEmail(email: string) {
    const UserModel = new User().getModelForClass(User);
    email = email.trim();
    return await UserModel.findOne({email: email});
  }

  public async getByUid(uid: string) {
    const UserModel = new User().getModelForClass(User);
    return await UserModel.findOne({uid});
  }

}

export interface IUserJWT {

  _id: string;
  uid: string;

}
