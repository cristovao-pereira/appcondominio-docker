import { Controller, Post, Body, Ip, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Limite estrito no Login: máximo 5 tentativas por minuto por IP
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Ip() ip: string) {
    // Tratamento de IP local no Docker / proxy reverso
    const clientIp = ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip;
    return this.authService.login(dto, clientIp);
  }

  // Endpoint seguro para obter os últimos logs de auditoria de segurança (útil para auditoria)
  @Get('audit-logs')
  async getAuditLogs() {
    return this.authService.getRecentLogs();
  }
}
