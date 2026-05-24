import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor.';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent: any = exception.getResponse();
      message = typeof resContent === 'object' && resContent.message ? resContent.message : exception.message;
      errorType = typeof resContent === 'object' && resContent.error ? resContent.error : 'HttpException';
    } else if (exception.code && exception.code.startsWith('P')) {
      // Erro conhecido do Prisma (ex: P2002 para violação de chave única)
      this.logger.warn(`Prisma error caught: [${exception.code}] ${exception.message}`);
      
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Já existe um registro com os dados fornecidos.';
        errorType = 'ConflictError';
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Erro de validação ou processamento de banco de dados.';
        errorType = 'DatabaseError';
      }
    } else {
      // Outros erros desconhecidos (ex: quebra de código, erros não tratados do banco, etc.)
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    // Retorna resposta limpa ao cliente, ocultando detalhes técnicos
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message[0] : message, // Se for array do ValidationPipe, pega a primeira
      error: errorType,
    });
  }
}
