import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from "../user/user.module";
import { RoomGateway } from "./room.gateway";
import { MessageModule } from "../message/message.module";

@Module({
  imports: [UserModule, MessageModule],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService]
})
export class RoomModule {
}
