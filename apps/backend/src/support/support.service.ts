import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupportDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupportTicket(dto: SupportDto) {
    return this.prisma.supportContact.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }

  // Busca parametrizada segura contra SQL Injection (CWE-89) usando Prisma
  async searchUsers(query: string) {
    if (!query || query.trim() === '') {
      return [];
    }

    // O Prisma automaticamente gera Prepared Statements com placeholders ($1, $2, etc.)
    // tornando a query 100% imune a injeções de comandos SQL.
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      take: 10,
    });
  }
}
