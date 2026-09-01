import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DatabaseHealthResponseDto, HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('system/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API availability' })
  @ApiOkResponse({ description: 'The API availability result.', type: HealthResponseDto })
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
    type: DatabaseHealthResponseDto,
  })
  getDatabaseHealth(): Promise<
    { status: 'ok'; database: 'connected' } | { status: 'error'; database: 'disconnected' }
  > {
    return this.healthService.getDatabaseHealth();
  }
}
