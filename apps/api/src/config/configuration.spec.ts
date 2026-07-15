import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';
import { swaggerConfig } from './swagger.config';
import { configValidationSchema } from './validation';

describe('application configuration', () => {
  it('provides sensible defaults for the app config', () => {
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3001';

    const config = appConfig();

    expect(config.env).toBe('development');
    expect(config.host).toBe('0.0.0.0');
    expect(config.port).toBe(3001);
    expect(config.name).toBe('open-garage-flow');
  });

  it('validates the expected environment shape', () => {
    const { error, value } = configValidationSchema.validate({
      NODE_ENV: 'production',
      APP_NAME: 'open-garage-flow',
      APP_VERSION: '1.0.0',
      HOST: '0.0.0.0',
      PORT: 3001,
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/opengarageflow',
      SWAGGER_ENABLED: true,
      CORS_ORIGIN: 'http://localhost:3000',
      LOG_LEVEL: 'debug',
      JWT_SECRET: 'secret',
      JWT_EXPIRES_IN: '7d',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '30d',
    });

    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3001);
  });

  it('exposes JWT defaults for development usage', () => {
    const config = jwtConfig();

    expect(config.expiresIn).toBe('7d');
    expect(config.refreshExpiresIn).toBe('30d');
  });

  it('keeps swagger enabled by default', () => {
    const config = swaggerConfig();

    expect(config.enabled).toBe(true);
  });
});
