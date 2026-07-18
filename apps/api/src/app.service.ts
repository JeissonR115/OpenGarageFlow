import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getApiDescription(): {
    name: string;
    version: string;
    status: 'running';
    documentation: string;
    baseUrl: string;
    domains: Record<string, string[]>;
  } {
    const globalPrefix = this.configService.getOrThrow<string>('app.globalPrefix');
    const docsPath = this.configService.getOrThrow<string>('app.docsPath');
    const apiVersion = this.configService.getOrThrow<string>('app.apiVersion');

    return {
      name: this.configService.getOrThrow<string>('app.name'),
      version: this.configService.getOrThrow<string>('app.version'),
      status: 'running',
      documentation: `/${globalPrefix}/${docsPath}`,
      baseUrl: `/${globalPrefix}/v${apiVersion}`,
      domains: {
        core: ['/core/companies'],
        crm: ['/crm/customers', '/crm/vehicles'],
        system: ['/system/health', '/system/info'],
      },
    };
  }
}
