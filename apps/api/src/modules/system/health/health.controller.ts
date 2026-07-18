import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('system/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API availability' })
  @ApiOkResponse({
    description: 'The API is available.',
    schema: {
      example: {
        status: 'ok',
        database: 'connected',
        timestamp: '2026-07-17T00:00:00.000Z',
      },
    },
  })
  getHealth(): Promise<
    | { status: 'ok'; database: 'connected'; timestamp: string }
    | { status: 'error'; database: 'disconnected'; timestamp: string }
  > {
    return this.healthService.getHealth();
  }

  @Get('database')
  @ApiOperation({ summary: 'Check database connectivity' })
  @ApiOkResponse({
    description: 'The database connectivity check result.',
    schema: { example: { status: 'ok', database: 'connected' } },
  })
  getDatabaseHealth(): Promise<
    { status: 'ok'; database: 'connected' } | { status: 'error'; database: 'disconnected' }
  > {
    return this.healthService.getDatabaseHealth();
  }
}
