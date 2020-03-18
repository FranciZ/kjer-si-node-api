import { Component } from '@nestjs/common';
import { Facebook, FacebookApiException } from 'fb';
import { FacebookLoginDTO } from './facebookOAuth.interface';
import { IOAuth } from '../oauth.interface';
import { InvalidTokenException } from '../../../../exceptions/invalidToken.exception';

@Injectable()
export class FacebookOauthService implements IOAuth<FacebookLoginDTO, any> {

  private client: any;

  private readonly APP_ID: string = '262182697603302';
  private readonly APP_SECRET: string = 'c70000da0cf10eb40f54a251cea945b1';

  constructor() {
    this.client = new Facebook({
      version: 'v2.4',
      appId: this.APP_ID,
      appSecret: this.APP_SECRET,
    });
  }

  /**
   * FIXME: It should reject/resolve based on response!!
   * @param {string} accessToken
   * @returns {Promise<any>}
   */
  public verifyToken(accessToken: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.client.api('me', { fields: 'id,name', access_token: accessToken }, (res) => {

      });
    });

  }

  /**
   * FIXME: We should add types to response
   * FIXME: Is this even needed?
   * @param {string} signedRequestValue
   * @returns {Promise<any>}
   */
  public parseSignedRequest(signedRequestValue: string): any {
    return this.client.parseSignedRequest(signedRequestValue, this.APP_SECRET);
  }

  /**
   * Get facebook user information
   * @param {string} accessToken
   * @returns {Promise<FacebookLoginDTO>}
   */
  public async getUserInfo(accessToken: string): Promise<FacebookLoginDTO> {

    try {
      this.client.setAccessToken(accessToken);
      const data = await this.client.api(
        '/me',
        { fields: ['id', 'name', 'email', 'picture.width(1000).height(1000)'] });

      data.birthday = new Date(data.birthday);

      if (isNaN(data.birthday.getTime())) {
        delete data.birthday;
      }

      return <FacebookLoginDTO>data;
    } catch (err) {
      console.log('Facebook error:', err);
      throw new InvalidTokenException();
    }

  }

  /**
   * Get facebook user's profile picture
   * @param {string} fbUserId
   * @returns {Promise<string>}
   */
  public async profilePicture(fbUserId: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      this.client.api(
        `/${fbUserId}/picture`,
        { height: 500, width: 500, redirect: false },
        (response) => {
          if (response && !response.error) return resolve(response.data.url);
          return reject(response.error);
        },
      ));
  }

}
