import { Module } from '@nestjs/common';
import { PublicAuthController } from './public.controller';
import { AuthCommonModule } from '../common/auth/auth.module';

@Module({
  imports: [AuthCommonModule],
  controllers: [PublicAuthController],
  providers: [],
})
export class AuthModule {
}
