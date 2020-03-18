import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { VFirebaseUpdate, VRegister, VUserLogin, VUserUpdate } from './user.validation';
import { UserService } from './user.service';
import { AuthenticatedUser } from '../../guards/authenticated-user.decorator';
import { UserRole } from './user.entity';
import { Roles } from '../../guards/roles.decorator';

@Controller()
export class UserController {

  constructor(private userService: UserService) {

  }

  @Get('v1/users/bootstrap')
  public async bootstrap(@AuthenticatedUser() user): Promise<any> {
    return await this.userService.userBootstrap(user);
  }

  @Post('v1/users/register')
  public async register(@Body() user: VRegister): Promise<any> {
    return await this.userService.register(user);
  }

  @Roles(UserRole.USER)
  @Post('v1/users/self/firebaseToken')
  public async updateFirebaseToken(@AuthenticatedUser() user, @Body() firebaseTokenData): Promise<any> {
    console.log('Firebase token data: ', firebaseTokenData);
    return await this.userService.updateFirebaseToken(user._id, firebaseTokenData.firebaseToken);
  }

  @Post('v1/users/login')
  public async login(@Body() user: VUserLogin): Promise<any> {
    return await this.userService.login(user);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Put('v1/users/self')
  public async updateSelf(@Body() updateData: VUserUpdate, @AuthenticatedUser() user): Promise<any> {
    return await this.userService.updateUser(user._id, updateData);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('v1/users/self')
  public async getSelf(@AuthenticatedUser() user): Promise<any> {
    console.log('user: ', user);
    return await this.userService.getUser(user._id, true);
  }

}
