import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotAllowedException extends HttpException {
  constructor(description?: string) {
    super(
      HttpException.createBody(
        description ? description : 'Not allowed access to this resource',
        'FORBIDDEN_EXCEPTION',
        HttpStatus.FORBIDDEN),
      HttpStatus.FORBIDDEN,
    );
  }
}
