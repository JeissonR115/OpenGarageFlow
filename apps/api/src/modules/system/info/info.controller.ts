import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { InfoService } from './info.service';

@ApiTags('System')
@Controller('system/info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  @ApiOperation({ summary: 'Get system information' })
  @ApiOkResponse({ description: 'The current system information.' })
  getSystemInfo(): {
    name: string;
    version: string;
    environment: string;
    uptime: number;
    timestamp: string;
  } {
    return this.infoService.getInfo();
  }
}
