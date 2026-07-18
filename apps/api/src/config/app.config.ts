import { registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME!,
  version: process.env.APP_VERSION!,
  apiVersion: process.env.API_VERSION ?? '1',

  host: process.env.HOST!,
  port: Number(process.env.PORT),

  corsOrigin: process.env.CORS_ORIGIN!,

  globalPrefix: 'api',
  docsPath: 'docs',
}));

export type AppConfig = ReturnType<typeof appConfig>;
export default appConfig;
