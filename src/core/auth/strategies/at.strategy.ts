import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Estrae il token dall'header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret', // Usa una variabile d'ambiente in produzione!
    });
  }

  validate(payload: any) {
    // Ciò che restituisci qui finirà in `req.user`
    return payload as { sub: number; email: string }; // Es: { sub: 1, email: 'test@test.com' }
  }
}
