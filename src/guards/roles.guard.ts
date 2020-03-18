import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { EmailNotVerifiedException } from '../modules/user/exceptions/emailNotVerified.exception';
import { BlockedException } from '../modules/user/exceptions/blocked.exception';
import { UnauthorizedException } from '../modules/user/exceptions/unauthorized.exception';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  // noinspection JSUnusedGlobalSymbols
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    let roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', context.getClass());

      if (!roles) return true;
    }

    const user = req.user;

    if (!user)
      throw new UnauthorizedException();

    // If user is not being impersonated and they are blocked
    if (req.user.blocked)
      throw new BlockedException();

    if (!user.role || !roles.find(role => role === user.role.toUpperCase())) {
      throw new ForbiddenException('this route is only accessible to ' + roles.join(', ').toLowerCase());
    }
    return true;
  }
}
