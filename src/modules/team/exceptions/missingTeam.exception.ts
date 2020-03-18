import { RequestException } from '../../../exceptions/request.exception';

export class MissingTeamException extends RequestException {
  code: number = 15;
  message: string = 'Team not found.';
}
