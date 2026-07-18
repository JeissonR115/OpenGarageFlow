import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CompaniesService } from '../services/companies.service';

@ApiTags('Companies')
@Controller('core/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'List companies' })
  @ApiOkResponse({ description: 'Companies retrieved successfully.' })
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiOkResponse({ description: 'Company retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a company (template)' })
  @ApiOkResponse({ description: 'Company creation template.' })
  create(): never {
    return this.companiesService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company (template)' })
  @ApiOkResponse({ description: 'Company update template.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  update(): never {
    return this.companiesService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company (template)' })
  @ApiOkResponse({ description: 'Company deletion template.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  remove(): never {
    return this.companiesService.remove();
  }
}
