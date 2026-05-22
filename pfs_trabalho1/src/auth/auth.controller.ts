import { BadRequestException, Controller, Post, Body, UseGuards, Request, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return {
      message: 'Usuário registrado com sucesso',
      user: userWithoutPassword,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { token, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      message: 'Login realizado com sucesso',
      token,
      user,
    };
  }

  @Post('refresh')
  async refreshToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token não fornecido');
    }

    const newToken = this.authService.refreshToken(token);

    return {
      message: 'Token renovado com sucesso',
      token: newToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    if (!req.user) {
      throw new Error('Não autenticado');
    }

    const user = await this.authService.getUserById(req.user.userId);

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }
}
