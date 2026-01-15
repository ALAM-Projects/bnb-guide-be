import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_AT_SECRET || 'at-secret-fallback';
    super({
      // Estrae il token dall'header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    // Ciò che restituisci qui finirà in `req.user`
    // Mappiamo 'sub' a 'id' per compatibilità con il decorator @GetUser()
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
