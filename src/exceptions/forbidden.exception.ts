import { RequestException } from './request.exception';

export class ForbiddenException extends RequestException {
  code: number = 6;

  constructor(message?: string) {
    super();
    this.message = 'Forbidden' + (message ? ': ' + message : '');
  }
}
