import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import 'dotenv/config';
import { AuthService } from './auth.service';
import { GoogleUser } from '../interfaces/google-user.interface';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_HOST } = process.env;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(
      private readonly authService: AuthService
    )
    {
        super({
            clientID    : GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL : `${API_HOST}/auth/google/callback`,
            passReqToCallback: true,
            scope: ['email', 'profile']
        })
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function)
    {
        try
        {
            const { name, emails, photos } = profile;
            const user: GoogleUser = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
                accessToken,
                refreshToken,
            };

            done(null, user);
        }
        catch(err)
        {
            done(err, false);
        }
    }
}


