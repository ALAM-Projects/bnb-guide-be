import {
  Body,
  Controller,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './auth.dto';
import { Public } from '@/shared/decorators/public.decorator';
import { RtGuard } from './guards/rt.guard';
import { Response } from 'express';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { ApiAction } from '@/shared/decorators/api-action.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiAction('post', 'Auth', 'signup')
  @Public()
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @ApiAction('post', 'Auth', 'login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false, // In dev (http) deve essere false
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
    });

    res.cookie('auth_token', tokens.access_token, {
      httpOnly: false, // Accessibile da JavaScript per le server functions
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minuti (deve coincidere con la durata del JWT)
    });

    return { access_token: tokens.access_token };
  }

  @ApiAction('post', 'Auth', 'refresh')
  @Public()
  @UseGuards(RtGuard)
  async refreshTokens(
    @GetUser() user: { sub: string; email: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken,
    );

    // Impostiamo i nuovi cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
    });

    res.cookie('auth_token', tokens.access_token, {
      httpOnly: false, // Accessibile da JavaScript
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 15, //15 secondui
    });

    return { access_token: tokens.access_token };
  }

  @ApiAction('post', 'Auth', 'logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  @ApiAction('post', 'Auth', 'forgot-password')
  @Public()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiAction('post', 'Auth', 'reset-password')
  @Public()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiAction('get', 'Auth', 'status')
  async getStatus(
    @Req()
    req: Request & { cookies: Record<string, string>; user: { id: string } },
  ): Promise<any> {
    const accessToken = req.cookies['auth_token'];
    const userId = req.user.id;

    try {
      // Se il token è valido, restituisci l'utente
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await this.authService.verifyAccessToken(
        accessToken,
        userId,
      );

      return { isAuthenticated: true, user };
    } catch {
      // Se è scaduto o mancante, ERRORE 401.
      // NON rigeneriamo nulla qui.
      throw new UnauthorizedException();
    }
  }
}
