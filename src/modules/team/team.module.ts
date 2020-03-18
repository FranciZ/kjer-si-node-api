import { Module } from '@nestjs/common';
import { AuthCommonModule } from '../common/auth/auth.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule {
}
