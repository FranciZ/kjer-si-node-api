import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthenticatedUser } from '../../guards/authenticated-user.decorator';
import { UserService } from "../user/user.service";
import { Roles } from "../../guards/roles.decorator";
import { User, UserRole } from "../user/user.entity";
import { VEvent } from "./event.validation";

@Controller()
export class EventController {

  constructor(private eventService: EventService, private userService: UserService) {

  }

  @Roles(UserRole.USER)
  @Post('v1/rooms/:roomId/events')
  async createEvent(@AuthenticatedUser() user, @Body() event: VEvent, @Param('roomId') roomId: string): Promise<any> {
    console.log('Room id: ', roomId);
    return this.eventService.createEvent(event, roomId, user._id);
  }

  @Roles(UserRole.USER)
  @Get('v1/rooms/:roomId/events')
  async getEvents(@AuthenticatedUser() user, @Param('roomId') roomId: string): Promise<any> {
    return this.eventService.getEvents(roomId);
  }

}
