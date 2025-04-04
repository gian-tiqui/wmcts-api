import {
  Body,
  Controller,
  Logger,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RateLimit } from 'nestjs-rate-limiter';
import { Register, Login, Refresh, Logout } from 'src/utils/types/types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @RateLimit({
    keyPrefix: 'register',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before registering again.',
  })
  @Post('register')
  register(@Body() registerDto: CreateUserDto): Promise<Register> {
    return this.authService.register(registerDto);
  }

  @RateLimit({
    keyPrefix: 'login',
    points: 10,
    duration: 10,
    errorMessage: 'Please wait before logging in again.',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<Login> {
    return this.authService.login(loginDto);
  }

  @RateLimit({
    keyPrefix: 'refresh-token',
    points: 100,
    duration: 60,
    errorMessage: 'Please wait before refreshing your token.',
  })
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<Refresh> {
    return this.authService.refresh(refreshTokenDto);
  }

  @RateLimit({
    keyPrefix: 'logout',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before logging out again.',
  })
  @Patch('logout')
  logout(@Query('userId', ParseIntPipe) userId: number): Promise<Logout> {
    return this.authService.logout(userId);
  }

  @RateLimit({
    keyPrefix: 'forgot-password',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before pressing forgot password.',
  })
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @RateLimit({
    keyPrefix: 'change-password',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before changing password.',
  })
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordAuthDto) {
    return this.authService.changePassword(
      changePasswordDto.userId,
      changePasswordDto.newPassword,
    );
  }
}
