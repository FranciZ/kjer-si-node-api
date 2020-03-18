import { User } from '../modules/user/user.entity';
import { createParamDecorator } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
  (data: any, req: any): User => {
    return req.user;
  },
);
