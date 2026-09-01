import { Injectable } from '@nestjs/common';

import { HealthRepository } from './repositories/health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async getHealth(): Promise<
    | { status: 'ok'; database: 'connected'; timestamp: string }
    | { status: 'error'; database: 'disconnected'; timestamp: string }
  > {
    const databaseHealth = await this.getDatabaseHealth();

    return { ...databaseHealth, timestamp: new Date().toISOString() };
  }

  async getDatabaseHealth(): Promise<
    { status: 'ok'; database: 'connected' } | { status: 'error'; database: 'disconnected' }
  > {
    if (await this.healthRepository.isDatabaseConnected()) {
      return { status: 'ok', database: 'connected' };
    }

    return { status: 'error', database: 'disconnected' };
  }
}
