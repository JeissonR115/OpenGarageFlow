import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: configService.getOrThrow<string>('app.corsOrigin'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerEnabled = configService.getOrThrow<boolean>('swagger.enabled');

  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(configService.getOrThrow<string>('app.name'))
        .setDescription('API for garage/workshop management platform')
        .setVersion(configService.getOrThrow<string>('app.version'))
        .build(),
    );

    SwaggerModule.setup('api/docs', app, document);
  }

  const host = configService.getOrThrow<string>('app.host');
  const port = configService.getOrThrow<number>('app.port');

  await app.listen(port, host);

  logger.log(`🚀 ${configService.getOrThrow<string>('app.name')} started`);
  logger.log(`🌐 http://${host}:${port}`);

  if (swaggerEnabled) {
    logger.log(`📚 http://${host}:${port}/api/docs`);
  }
}

void bootstrap();
