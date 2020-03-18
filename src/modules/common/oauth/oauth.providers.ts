import { FACEBOOK_OAUTH_TOKEN, GOOGLE_OAUTH_TOKEN } from './oauth.constants';
import { GoogleOauthService } from './google/googleOAuth.service';
import { FacebookOauthService } from './facebook/facebookOAuth.service';

export const oauthProviders = [
  {
    provide: GOOGLE_OAUTH_TOKEN,
    useClass: GoogleOauthService,
  },
  {
    provide: FACEBOOK_OAUTH_TOKEN,
    useClass: FacebookOauthService,
  },
];
