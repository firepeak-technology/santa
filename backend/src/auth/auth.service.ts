import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly adminEmail = process.env.ADMIN_EMAIL;

    constructor(private jwtService: JwtService) {}

    async validateGoogleUser(profile: any): Promise<any> {
        const email = profile.emails[0].value;
        const isAdmin = email === this.adminEmail;
        console.log(this.adminEmail);
        console.log({
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',})

        return {
            email,
            name: profile.displayName,
            picture: profile.photos[0]?.value,
            isAdmin,
        };
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            name: user.name,
            picture: user.picture,
            isAdmin: user.isAdmin,
        };

        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }

    async validateToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }
}
