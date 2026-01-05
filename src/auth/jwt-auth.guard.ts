// src/auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // This will print the EXACT reason for the 401 in your terminal
        if (info) {
            console.log('JWT Error Message:', info.message);
        }

        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}