import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: any) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['refresh_token'];
        }
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // 1. Prova a prendere il token dai cookie
    let refreshToken = req.cookies?.['refresh_token'];

    // 2. Se non c'è (fallback), prova dall'header
    if (!refreshToken) {
      refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
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
