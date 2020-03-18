import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Team, User, UserRole } from '../user/user.entity';
import { Roles, TeamRoles } from '../../guards/roles.decorator';
import { TeamService } from './team.service';
import { VCreateTeam, VUpdateTeam } from './team.validation';
import { AuthenticatedUser } from '../../guards/authenticated-user.decorator';
import { Story } from '../story/story.entity';

@Roles(UserRole.USER)
@Controller()
export class TeamController {

  constructor(private teamService: TeamService) {

  }

  @Get('/v1/team/:teamId')
  async getTeam(@AuthenticatedUser() user, @Param('teamId') teamId: string) {
    const TeamModel = new Team().getModelForClass(Team);
    return await TeamModel.findOne({
      'members.user': user._id,
      _id: teamId
    }).populate('members.user image');
  }

  @Post('/v1/team')
  async createTeam(@AuthenticatedUser() user, @Body() data: VCreateTeam) {
    const team = await this.teamService.createTeam(user, data.name, data.image);
    return {
      _id: team._id,
      name: team.name,
      role: 'ADMIN'
    };
  }

  @TeamRoles('ADMIN')
  @Put('/v1/team/:teamId')
  async updateTeam(@Body() teamData: VUpdateTeam, @Param('teamId') teamId: string) {
    const TeamModel = new Team().getModelForClass(Team);
    return await TeamModel.findByIdAndUpdate(teamId, teamData, { new: true }).populate('members.user image');
  }

  @TeamRoles('ADMIN')
  @Delete('/v1/team/:teamId')
  async deleteTeam(@Param('teamId') teamId: string) {
    const TeamModel = new Team().getModelForClass(Team);
    return await TeamModel.findByIdAndRemove(teamId);
  }

}
