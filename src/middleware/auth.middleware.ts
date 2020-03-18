import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { TeamService } from '../modules/team/team.service';
import * as Route from 'route-parser';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private userService: UserService, private teamService: TeamService) {
  }

  async use(req, res, next: Function) {

    const authorization: string = req.headers.authorization;

    if (authorization) {

      try {
        let userJWT = this.userService.verifyAuthToken(authorization);
        req.user = await this.userService.getUser(userJWT._id);
      } catch (err) {
      }
    }

    try {
      const route = new Route('*a/team/:teamId*a');
      const teamParams = route.match(req.path);
      if (teamParams.teamId && teamParams.teamId !== undefined) {
        const teamMember = await this.teamService.isUserInTeam(req.user._id, teamParams.teamId);
        if (teamMember) {
          req.teamMember = teamMember;
        }
      }
    } catch (err) {
    }

    next();
  };

}
