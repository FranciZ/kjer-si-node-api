import { Get, Controller, Body, Post } from '@nestjs/common';
import { AuthService } from '../common/auth/auth.service';

@Controller()
export class PublicAuthController {


  constructor(private authService: AuthService) {

  }

  @Post('/v1/login')
  login(@Body() body): string {

    if (body.email === 'dvorane@ljubljanskigrad.si' && body.password === '3DvoraneVidim!') {
      const token = this.authService.sign(1, {expires: '30d'});
      return token;
    }
  }

  @Get('/v1/ping')
  ping(@Body() body): string {
    console.log('Ping');
    return 'pong';
  }
}
