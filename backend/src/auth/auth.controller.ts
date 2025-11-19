import { Controller, Get, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        try {
            // Na Google OAuth, req.user bevat de user info
            const { access_token, user } = await this.authService.login(req.user);
            // Redirect naar frontend met JWT token
            const frontendUrl = process.env.FRONTEND_URL  ;
            console.log('frontendUrl', frontendUrl);
            res.redirect(`${frontendUrl}/auth/callback?token=${access_token}`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            const frontendUrl = process.env.FRONTEND_URL;
            res.redirect(`${frontendUrl}?error=auth_failed`);
        }
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        return req.user;
    }
}
