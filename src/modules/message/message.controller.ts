import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthenticatedUser } from '../../guards/authenticated-user.decorator';
import { UserService } from "../user/user.service";
import { Roles } from "../../guards/roles.decorator";
import { User, UserRole } from "../user/user.entity";
import { VUserLogin } from "../user/user.validation";
import { VMessage } from "./message.validation";

@Controller()
export class MessageController {

  constructor(private messageService: MessageService, private userService: UserService) {

  }

  @Get('v1/rooms/:roomId/messages')
  async getRoomCategories(@AuthenticatedUser() user): Promise<any> {
    return 'Success';
  }

}
