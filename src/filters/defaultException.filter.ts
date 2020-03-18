import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {

  public catch(exception: Error, host: ArgumentsHost): void {
    host.switchToHttp().getResponse().status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
  }
}
