import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OpenGarageFlow API')
    .setDescription('API for garage/workshop management platform')
    .setVersion('0.1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const host = process.env.HOST ?? '0.0.0.0';
  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port, host);

  console.log('OpenGarageFlow API is running');
  console.log(`http://${host}:${port}`);
  console.log('Swagger: /api');
}
void bootstrap();
