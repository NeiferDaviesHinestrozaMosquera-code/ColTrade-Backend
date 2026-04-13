import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Seguridad ─────────────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Prefijo global ────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Validación global ─────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // elimina propiedades no decoradas
      forbidNonWhitelisted: true,
      transform: true,           // convierte primitivos automáticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger ───────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ColTrade API')
      .setDescription('Backend REST API para la plataforma ColTrade de comercio exterior')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Autenticación y sesiones')
      .addTag('Operations', 'Operaciones de importación y exportación')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log('📖 Swagger disponible en /api/docs');
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 ColTrade Backend corriendo en http://localhost:${port}/api/v1`);
}

bootstrap();
