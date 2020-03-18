import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthenticatedUser } from '../../guards/authenticated-user.decorator';
import { UserService } from "../user/user.service";
import { Roles } from "../../guards/roles.decorator";
import { User, UserRole } from "../user/user.entity";
import { VUserLogin } from "../user/user.validation";
import { VGetMessages, VLocation, VRoom } from "./room.validation";

@Controller()
export class RoomController {

  constructor(private roomService: RoomService, private userService: UserService) {

  }

  @Get('v1/rooms/categories')
  async getRoomCategories(@AuthenticatedUser() user): Promise<any> {
    return this.roomService.getRoomCategories();
    // return this.userService.getRandomNickname();
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Post('v1/rooms')
  async createRoom(@AuthenticatedUser() user, @Body() room: VRoom): Promise<any> {
    return this.roomService.createRoom(user, room);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Post('v1/map/rooms')
  async getRoomsInRadius(@AuthenticatedUser() user, @Body() location: VLocation): Promise<any> {
    return this.roomService.findRoomsInRadius(location.lat, location.lng, user._id);
  }

  @Roles(UserRole.USER)
  @Post('v1/rooms/:roomId/join')
  async joinRoom(@AuthenticatedUser() user, @Param('roomId') roomId: string): Promise<any> {
    return this.roomService.joinRoom(user._id, roomId);
  }

  @Roles(UserRole.USER)
  @Post('v1/rooms/:roomId/messages')
  async getMessages(@AuthenticatedUser() user, @Param('roomId') roomId: string, @Body() data: VGetMessages): Promise<any> {
    return this.roomService.getRoomMessages(roomId, data.beforeDate);
  }

  @Roles(UserRole.USER)
  @Post('v1/rooms/:roomId/leave')
  async leaveRoom(@AuthenticatedUser() user, @Param('roomId') roomId: string): Promise<any> {
    return this.roomService.leaveRoom(user._id, roomId);
  }

}
