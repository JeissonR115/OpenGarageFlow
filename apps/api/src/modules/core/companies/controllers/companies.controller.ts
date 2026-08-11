import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompaniesService } from '../services/companies.service';

@ApiTags('Companies')
@Controller('core/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'List companies' })
  @ApiOkResponse({
    description: 'Companies retrieved successfully.',
    type: CompanyResponseDto,
    isArray: true,
  })
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiOkResponse({ description: 'Company retrieved successfully.', type: CompanyResponseDto })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a company (template)' })
  @ApiNotImplementedResponse({ description: 'Company creation is not implemented yet.' })
  create(): never {
    return this.companiesService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company (template)' })
  @ApiNotImplementedResponse({ description: 'Company update is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  update(): never {
    return this.companiesService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company (template)' })
  @ApiNotImplementedResponse({ description: 'Company deletion is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  remove(): never {
    return this.companiesService.remove();
  }
}
