import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  version: process.env.APP_VERSION,

  environment: process.env.NODE_ENV ?? 'development',

  host: process.env.HOST ?? '0.0.0.0',

  port: Number(process.env.PORT ?? 3001),

  logLevel: process.env.LOG_LEVEL ?? 'debug',

  corsOrigin: process.env.CORS_ORIGIN,
}));
