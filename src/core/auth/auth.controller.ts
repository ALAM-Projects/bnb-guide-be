import { Body, Controller, UseGuards, Res } from '@nestjs/common';
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

    return { access_token: tokens.access_token };
  }

  @ApiAction('post', 'Auth', 'refresh')
  @Public()
  @UseGuards(RtGuard)
  refreshTokens(@GetUser() user: any) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @ApiAction('post', 'Auth', 'logout')
  async logout(
    @GetUser('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
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
}
