import { RequestException } from './request.exception';

export class InvalidTokenException extends RequestException {
  code: number = 9;
  message: string = 'Invalid accessToken';
}
