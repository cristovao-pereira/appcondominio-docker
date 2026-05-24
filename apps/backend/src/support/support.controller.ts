import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportDto } from './dto/support.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Limite estrito no envio de suporte: máximo 5 envios por minuto por IP para evitar spam/DoS
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTicket(@Body() dto: SupportDto) {
    return this.supportService.createSupportTicket(dto);
  }

  // Limite na busca: 30 buscas por minuto por IP
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get('search')
  async search(@Query('q') query: string) {
    return this.supportService.searchUsers(query);
  }
}
