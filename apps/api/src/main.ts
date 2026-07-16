import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap(): Promise<void> {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const config = app.get(ConfigService);

  const appConfig = config.getOrThrow<AppConfig>('app');
  const swaggerEnabled = config.getOrThrow<boolean>('swagger.enabled');

  const { name, version, host, port, globalPrefix, docsPath, corsOrigin } = appConfig;

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: corsOrigin });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(name)
        .setDescription('API for garage/workshop management platform')
        .setVersion(version)
        .build(),
    );

    SwaggerModule.setup(`${globalPrefix}/${docsPath}`, app, document);
  }

  await app.listen(port, host);

  const serverUrl = `http://${host}:${port}`;

  logger.log(`${name} v${version} started successfully`);
  logger.log(`Application: ${serverUrl}`);
  logger.log(`API: ${serverUrl}/${globalPrefix}`);

  if (swaggerEnabled) {
    logger.log(`Documentation: ${serverUrl}/${globalPrefix}/${docsPath}`);
  }
}

void bootstrap();
