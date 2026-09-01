import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiInfoResponseDto } from './dto/api-info-response.dto';
import { AppService } from './app.service';

@ApiTags('API')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiOkResponse({
    description: 'API information retrieved successfully.',
    type: ApiInfoResponseDto,
  })
  getApiDescription() {
    return this.appService.getApiDescription();
  }
}
