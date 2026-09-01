import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CustomerResponseDto } from '../dto/customer-response.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('Customers')
@Controller('crm/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({
    description: 'Customers retrieved successfully.',
    type: CustomerResponseDto,
    isArray: true,
  })
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiOkResponse({ description: 'Customer retrieved successfully.', type: CustomerResponseDto })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  async findById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer (template)' })
  @ApiNotImplementedResponse({ description: 'Customer creation is not implemented yet.' })
  create(): never {
    return this.customersService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer (template)' })
  @ApiNotImplementedResponse({ description: 'Customer update is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  update(): never {
    return this.customersService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer (template)' })
  @ApiNotImplementedResponse({ description: 'Customer deletion is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Customer was not found.' })
  remove(): never {
    return this.customersService.remove();
  }
}
