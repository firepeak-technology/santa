import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/auth/google/callback`,
            scope: ['email', 'profile'],
        });


        console.log('Google Strategy initialized');
        console.log('Callback URL:', `${process.env.API_URL || 'http://localhost:3000'}/auth/google/callback`);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        console.log('Google OAuth validate called');
        console.log('Profile:', profile);

        try {
            const user = await this.authService.validateGoogleUser(profile);
            console.log('User validated:', user);
            done(null, user);
        } catch (error) {
            console.error('Validation error:', error);
            done(error, null);
        }
    }
}
