import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';
import { ConfirmRequestDto } from './dto/confirm.request.dto';
import { RefreshTokenRequestDto } from './dto/refreshToken.request.dto';
import { RegisterRequestDto } from './dto/register.request.dto';
import JwtAuthenticationGuard from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.register(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.authenticate(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm')
  async confirm(@Body() data: ConfirmRequestDto) {
    try {
      return await this.authService.confirm(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('resendCode')
  async resendCode(@Body('name') name: string) {
    try {
      return await this.authService.resendCode(name);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('refresh')
  async refresh(@Body() data: RefreshTokenRequestDto) {
    try {
      return await this.authService.refreshToken(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async me(@Req() req) {
    return req.user;
  }
}
