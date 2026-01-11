import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        let token: string | null = null;
        if (req && req.cookies) {
          token = req.cookies['refresh_token'] as string;
        }
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; email: string }) {
    // 1. Prova a prendere il token dai cookie
    let refreshToken: string | null = req.cookies?.['refresh_token'] as string;

    // 2. Se non c'è (fallback), prova dall'header
    if (!refreshToken) {
      refreshToken = req
        .get('authorization')
        ?.replace('Bearer', '')
        .trim() as string;
    }

    // 3. Se non c'è in nessuno dei due posti, allora lancia l'errore
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token not found in cookies or header',
      );
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
