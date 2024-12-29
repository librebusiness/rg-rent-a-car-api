import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import 'dotenv/config';
import { COOKIE_NAMES } from './constants';
import { Public } from './public.metadata';

const { APP_HOST, APP_LOGIN_WITH_GOOGLE_SUCCESS_URL, APP_LOGIN_WITH_GOOGLE_FAILURE_URL } = process.env;

@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService ) { }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const jwt = await this.authService.googleSignIn(req.user, res);
    if (jwt) {
      res.redirect(`${APP_LOGIN_WITH_GOOGLE_SUCCESS_URL}/`+jwt);
    } else {
      res.redirect(`${APP_LOGIN_WITH_GOOGLE_FAILURE_URL}`);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string, password: string }, @Res() res: any) {
    res.json(await this.authService.signIn(res, body.email, body.password));
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Res() res: any) {
    const result = await this.authService.signUp(res, body);
    return res.json({ access_token: result });
  }

  @Public()
  @Post('recover')
  recover(@Body() body: { email: string }) {
    return this.authService.recoverPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  reset(@Body() body: { email: string, token: string, password: string }) {
    return this.authService.resetPassword(body.email, body.token, body.password);
  }

  @Get('profile')
  profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @Patch('profile')
  update(@Request() req: any, @Body() body: UpdateUserDto) {
    return this.authService.updateProfile(req.user.sub, body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: any, @Res() res: any) {
    res.clearCookie(COOKIE_NAMES.JWT, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return res.json({
      message: 'Logout successful',
    });
  }
}


