import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CustomersService } from '../services/customers.service';

@ApiTags('Customers')
@Controller('crm/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({ description: 'Customers retrieved successfully.' })
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiOkResponse({ description: 'Customer retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  async findById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer (template)' })
  @ApiOkResponse({ description: 'Customer creation template.' })
  create(): never {
    return this.customersService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer (template)' })
  @ApiOkResponse({ description: 'Customer update template.' })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  update(): never {
    return this.customersService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer (template)' })
  @ApiOkResponse({ description: 'Customer deletion template.' })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  remove(): never {
    return this.customersService.remove();
  }
}
