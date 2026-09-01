import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { appConfig, databaseConfig, jwtConfig, swaggerConfig } from './';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env.local', '.env'],
      load: [appConfig, databaseConfig, jwtConfig, swaggerConfig],
      validationOptions: {
        abortEarly: false,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

        APP_NAME: Joi.string().required(),
        APP_VERSION: Joi.string().required(),
        API_VERSION: Joi.string().default('1'),

        HOST: Joi.string().default('0.0.0.0'),

        PORT: Joi.number().port().default(3001),

        DATABASE_URL: Joi.string().uri().required(),

        SWAGGER_ENABLED: Joi.boolean().default(true),

        CORS_ORIGIN: Joi.string().required(),

        LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),

        JWT_SECRET: Joi.string().required(),

        JWT_EXPIRES_IN: Joi.string().default('15m'),

        JWT_REFRESH_SECRET: Joi.string().required(),

        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
      }),
    }),
  ],
})
export class ConfigurationModule {}
