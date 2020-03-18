import { Component, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InvalidTokenException } from './invalidToken.exception';
import { IJWTObject } from './auth.interface';

@Injectable()
export class AuthService {

  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor() {
  }

  /**
   * Verify payload, return JWT Object
   * @param {string} payload
   * @returns {IJWTObject}
   */
  public verify(payload: string): IJWTObject {
    try {
      return <IJWTObject>jwt.verify(payload, this.JWT_SECRET);
    } catch (err) {
      throw new InvalidTokenException();
    }
  }

  /**
   * Sign authentication payload
   * @param {number} userId
   * @param options
   * @returns {string}
   */
  public sign(userId: number, options?: { expires: string }): string {
    const jwtObject: IJWTObject = {
      userId
    };

    return jwt.sign(<object> jwtObject, this.JWT_SECRET, {
      expiresIn: options.expires || '24h',
    });
  }
}
