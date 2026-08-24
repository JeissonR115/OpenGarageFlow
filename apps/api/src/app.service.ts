import { Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService } from '@nestjs/core';
import { ApiInfoResponseDto } from './dto/api-info-response.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly discoveryService: DiscoveryService,
  ) {}

  getApiDescription(): ApiInfoResponseDto {
    const globalPrefix = this.configService.getOrThrow<string>('app.globalPrefix');
    const docsPath = this.configService.getOrThrow<string>('app.docsPath');
    const apiVersion = this.configService.getOrThrow<string>('app.apiVersion');

    return {
      name: this.configService.getOrThrow<string>('app.name'),
      version: this.configService.getOrThrow<string>('app.version'),
      status: 'running',
      documentation: `/${globalPrefix}/${docsPath}`,
      baseUrl: `/${globalPrefix}/v${apiVersion}`,
      domains: this.getDomains(),
    };
  }

  private getDomains(): Record<string, string[]> {
    const domains = new Map<string, Set<string>>();
    const globalPrefix = this.configService.getOrThrow<string>('app.globalPrefix');
    const apiVersion = this.configService.getOrThrow<string>('app.apiVersion');

    for (const controller of this.discoveryService.getControllers()) {
      if (!controller.metatype) {
        continue;
      }

      const paths = Reflect.getMetadata(PATH_METADATA, controller.metatype) as
        string | string[] | undefined;

      for (const path of Array.isArray(paths) ? paths : [paths]) {
        const normalizedPath = path?.replace(/^\/+|\/+$/g, '');

        if (!normalizedPath) {
          continue;
        }

        const domain = normalizedPath.split('/')[0];
        const routes = domains.get(domain) ?? new Set<string>();

        routes.add(`/${globalPrefix}/v${apiVersion}/${normalizedPath}`);
        domains.set(domain, routes);
      }
    }

    return Object.fromEntries(
      [...domains.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([domain, routes]) => [domain, [...routes].sort()]),
    );
  }
}
