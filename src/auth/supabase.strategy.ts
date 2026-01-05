import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('SUPABASE_JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            ignoreExpiration: false,
            algorithms: ['HS256'],
        });
    }

    async validate(...args: any[]): Promise<any> {
        return args[0];
    }

}