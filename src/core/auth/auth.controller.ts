import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { Public } from '@/shared/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RtGuard } from './guards/rt.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @Public()
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @ApiTags('Auth')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
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

  @ApiTags('Auth')
  @Public()
  @UseGuards(RtGuard) // Guard per la refresh token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: any) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    console.log('Cookies ricevuti dal server:', req.cookies);

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiTags('Auth')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.sub);

    // Cancelliamo il cookie dal browser
    res.clearCookie('refresh_token', { path: '/' });

    return { message: 'Logged out' };
  }
}
