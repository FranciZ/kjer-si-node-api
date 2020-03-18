import { Component } from '@nestjs/common';
import { OAuth } from 'oauth';
import * as _google from 'googleapis';
import { IGooglePlusResponse, IGoogleTokenResponse } from './googleOAuth.interface';
import { IOAuth } from '../oauth.interface';
import { InvalidTokenException } from '../../../../exceptions/invalidToken.exception';

const google = _google as any;

@Injectable()
export class GoogleOauthService implements IOAuth<IGooglePlusResponse, any> {

  private client: any;

  private readonly clientID: string = '26045416535-93g2noed7alrlu264v0lapvs1vo85ajf.apps.googleusercontent.com';
  private readonly clientSecret: string = 'OzkaEa9QUEb8CR9KYr1Xab2A';
  private readonly redirectURL: string = 'http://localhost:3031/api/v1/oauth/google/redirect';
  private readonly scopes: Array<string> = ['profile', 'email'];

  constructor() {
    const OAuth2 = google.auth.OAuth2;
    this.client = new OAuth2(this.clientID, this.clientSecret, this.redirectURL);
  }

  // todo: Is it needed?
  public get authUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
  }

  // todo: Is it needed?
  public getToken(code: string): Promise<IGoogleTokenResponse> {

    return new Promise((resolve, reject) => {

      this.client.getToken(code, (err, tokens) => {
        if (err) return reject(err);

        resolve(tokens);
        this.client.setCredentials(tokens);
      });
    });
  }

  /**
   * Verifies with Google that the accessToken passed is valid Google user accessToken
   * @param {string} token
   * @returns {Promise<any>}
   */
  public verifyToken(token: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.client.verifyIdToken(
        token,
        this.clientID,
        (e, login) => {
          if (e) return reject(e);
          const payload = login.getPayload();
          resolve(payload);
        });

    }).catch(() => {
      throw new InvalidTokenException();
    });
  }

  /**
   * Get accessToken user details
   * @param {string} accessToken
   * @returns {Promise<IGooglePlusResponse>}
   */
  public getUserInfo(accessToken: string): Promise<IGooglePlusResponse> {

    this.client.setCredentials({
      access_token: accessToken,
    });

    const plus = google.plus('v1');

    return new Promise((resolve, reject) => {
      plus.people.get(
        {
          userId: 'me',
          auth: this.client,
        },
        (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
    });
  }

}
