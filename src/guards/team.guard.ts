import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '../modules/user/exceptions/unauthorized.exception';
import { MissingTeamException } from '../modules/team/exceptions/missingTeam.exception';
import { ResourceNotAllowedException } from '../modules/team/exceptions/resourceNotAllowed.exception';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class TeamGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  // noinspection JSUnusedGlobalSymbols
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    // if there is no teamId in parameters ignore this guard
    if (!req.params.teamId) {
      return true;
    }

    // get roles from TeamRoles decorator if present
    let roles = this.reflector.get<string[]>('teamRoles', context.getHandler());
    if (!roles) {
      roles = this.reflector.get<string[]>('teamRoles', context.getClass());
    }

    // if there are no roles passed but there is a found teamMember let the request through and assume wildcard roles
    if ((!roles || roles === undefined) && (req.teamMember && req.teamMember !== undefined)) {
      // console.log('Route with wildcard team role permission');
      return true;
    }

    const teamMember = req.teamMember;
    const user = req.user;

    if (!teamMember)
      throw new MissingTeamException();

    if (!user)
      throw new UnauthorizedException();

    if (!teamMember.role || !roles.find(role => role === teamMember.role.toUpperCase())) {
      throw new ResourceNotAllowedException('this route is only accessible to team members with roles: ' + roles.join(', ').toLowerCase());
    }
    return true;
  }
}
