import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita cabeçalhos de segurança HTTP com Helmet
  app.use(helmet());

  // Habilita CORS de forma segura
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000', // Ajustar conforme ambiente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix("api");

  // Filtro global de exceções contra Information Disclosure (CWE-209)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Pipe global de validação e sanitização estrita de payloads (previne Mass Assignment)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
