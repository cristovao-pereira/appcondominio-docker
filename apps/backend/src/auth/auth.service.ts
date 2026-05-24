import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    // Verifica se e-mail já está cadastrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
    }

    // Hash da senha com salt 12 para alta resistência contra ataques offline
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        password: hashedPassword,
        role: dto.role || 'resident',
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async login(dto: LoginDto, ip: string) {
    const genericErrorMessage = 'E-mail ou senha incorretos.';
    
    // Busca usuário pelo e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Registra a falha no log de segurança (CWE-208 - não revelar se o e-mail existe)
      await this.logSecurityEvent(ip, 'login_failed', dto.email, 'Usuário inexistente ou senha incorreta.');
      throw new UnauthorizedException(genericErrorMessage);
    }

    // Compara senha usando bcrypt constante
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Registra a falha no log
      await this.logSecurityEvent(ip, 'login_failed', user.email, 'Senha incorreta.');
      throw new UnauthorizedException(genericErrorMessage);
    }

    // Login bem sucedido
    await this.logSecurityEvent(ip, 'login_success', user.email, 'Autenticação bem sucedida.');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async logSecurityEvent(ip: string, event: string, username?: string, details?: string) {
    try {
      await this.prisma.securityAuditLog.create({
        data: {
          ip,
          event,
          username,
          details,
        },
      });
    } catch (error) {
      // Apenas exibe no console para não derrubar o fluxo se o log falhar
      console.error('Falha ao registrar log de auditoria de segurança:', error);
    }
  }

  async getRecentLogs() {
    return this.prisma.securityAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
