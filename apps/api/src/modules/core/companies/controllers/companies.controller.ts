import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CompanyResponseDto } from '../dto/company-response.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
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
  @ApiBadRequestResponse({ description: 'Invalid company ID.' })
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a company' })
  @ApiCreatedResponse({ description: 'Company created successfully.', type: CompanyResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiOkResponse({ description: 'Company updated successfully.', type: CompanyResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid company ID or request data.' })
  @ApiNotFoundResponse({ description: 'Company was not found.' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }
}
