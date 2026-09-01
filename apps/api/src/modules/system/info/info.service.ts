import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfoService {
  constructor(private readonly configService: ConfigService) {}

  getInfo(): {
    name: string;
    version: string;
    environment: string;
    uptime: number;
    timestamp: string;
  } {
    return {
      name: this.configService.getOrThrow<string>('app.name'),
      version: this.configService.getOrThrow<string>('app.version'),
      environment: this.configService.getOrThrow<string>('NODE_ENV'),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
