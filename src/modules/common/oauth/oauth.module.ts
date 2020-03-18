import { Module } from '@nestjs/common';
import { FacebookOauthService } from './facebook/facebookOAuth.service';
import { GoogleOauthService } from './google/googleOAuth.service';

@Module({
  providers: [
    FacebookOauthService,
    GoogleOauthService,
  ],
  exports: [
    FacebookOauthService,
    GoogleOauthService,
  ],
})
export class OAuthModule {
}
