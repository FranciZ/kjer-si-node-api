import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/common/database/database.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TeamModule } from './modules/team/team.module';
import { RoomModule } from "./modules/room/room.module";
import { MessageModule } from "./modules/message/message.module";
import { EventModule } from "./modules/event/event.module";
import { AppService } from "./app.service";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    FileModule,
    UserModule,
    TeamModule,
    RoomModule,
    MessageModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class ApplicationModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
