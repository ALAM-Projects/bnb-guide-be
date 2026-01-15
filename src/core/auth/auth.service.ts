import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ResetPasswordDto, SignupDto } from './auth.dto';
import { MailService } from '@/shared/mail/mail.service';
import { DBManager } from '@/infrastructure/database/database.manager';
// import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private mail: MailService,
    private dbManager: DBManager,
  ) {}

  async signup(dto: SignupDto) {
    // 1. Genera l'hash della password
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const newUser = {
        name: dto.name,
        surname: dto.surname,
        email: dto.email,
        password: hash,
      };
      // 2. Salva l'utente nel database
      const user = await this.dbManager.users.create(newUser);

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email già esistente');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    // 1. Trova l'utente tramite email
    const user = await this.dbManager.users.findUnique({
      email: dto.email,
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
      this.jwt.signAsync({ sub: userId, email }, {
        secret: process.env.JWT_AT_SECRET,
        expiresIn: process.env.JWT_AT_EXPIRES_IN,
      } as any),
      this.jwt.signAsync({ sub: userId, email }, {
        secret: process.env.JWT_RT_SECRET,
        expiresIn: process.env.JWT_RT_EXPIRES_IN,
      } as any),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.dbManager.users.update({ id: userId }, { hashedRt: hash });
  }

  // src/auth/auth.service.ts

  async refreshTokens(userId: string, rt: string) {
    const user = await this.dbManager.users.findUnique({
      id: userId,
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
    await this.dbManager.users.update({ id: userId }, { hashedRt: null });

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.dbManager.users.findUnique({ email });
    if (!user) return; // Non confermiamo l'esistenza dell'email per privacy

    const token = Math.random().toString(36).substring(2, 15); // Token in chiaro
    const hash = await bcrypt.hash(token, 10); // Hash da salvare nel DB

    const expires = new Date(Date.now() + 15 * 60 * 1000); // Scadenza 15 min

    await this.dbManager.users.update(
      { email },
      { resetToken: hash, resetTokenExpiresAt: expires },
    );

    // Invia il token IN CHIARO via email
    await this.mail.sendResetPasswordEmail(email, token);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.dbManager.users.findUnique({
      email: dto.email,
      resetTokenExpiresAt: { gt: new Date() }, // Token non scaduto
    });

    if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
      throw new ForbiddenException('Richiesta non valida');
    }

    // Controllo scadenza
    if (new Date() > user.resetTokenExpiresAt) {
      throw new ForbiddenException('Token scaduto');
    }

    // Confronto hash
    const isTokenValid = await bcrypt.compare(dto.token, user.resetToken);
    if (!isTokenValid) {
      throw new ForbiddenException('Token non valido');
    }

    // 2. Hashiamo la nuova password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // 3. Aggiorniamo l'utente e cancelliamo i campi di reset
    await this.dbManager.users.update(
      { id: user.id },
      { password: hashedPassword, resetToken: null, resetTokenExpiresAt: null },
    );
  }

  async verifyAccessToken(token: string, userId: string): Promise<any> {
    if (!token) throw new Error('Token non valido');
    const auth = await this.jwt.verify(token, { secret: 'at-secret' });
    if (!auth) await this.refreshTokens(userId, auth.refreshToken);
  }
}
