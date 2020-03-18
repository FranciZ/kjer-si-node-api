import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      HttpException.createBody(
        'Unauthorized',
        'UNAUTHORIZED_EXCEPTION',
        HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED,
    );
  }
}
