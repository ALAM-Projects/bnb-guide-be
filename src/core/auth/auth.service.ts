import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './auth.dto';
// import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(dto: SignupDto) {
    // 1. Genera l'hash della password
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      // 2. Salva l'utente nel database
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
          password: hash,
        },
      });

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email già esistente');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    // 1. Trova l'utente tramite email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Credenziali errate');

    // 2. Confronta la password
    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new ForbiddenException('Credenziali errate');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: 'at-secret', expiresIn: '10s' },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: 'rt-secret', expiresIn: '7d' },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  // src/auth/auth.service.ts

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // 1. L'utente esiste e ha un RT salvato?
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    // 2. Il RT inviato corrisponde a quello nel DB?
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    // 3. Se tutto ok, genera nuovi token
    const tokens = await this.getTokens(user.id, user.email);

    // 4. Aggiorna il DB con il nuovo hash (rotazione del token)
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // Aggiorna il metodo logout
  async logout(userId: string) {
    // Utilizziamo updateMany per sicurezza, ma puntiamo all'ID unico
    // Impostiamo hashedRt a null per invalidare il Refresh Token
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: { not: null },
      },
      data: {
        hashedRt: null,
      },
    });
    return { message: 'Logged out successfully' };
  }
}
