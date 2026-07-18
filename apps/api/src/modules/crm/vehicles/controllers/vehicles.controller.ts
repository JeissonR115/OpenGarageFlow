import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { VehiclesService } from '../services/vehicles.service';

@ApiTags('Vehicles')
@Controller('crm/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles' })
  @ApiOkResponse({ description: 'Vehicles retrieved successfully.' })
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiOkResponse({ description: 'Vehicle retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  async findById(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a vehicle (template)' })
  @ApiOkResponse({ description: 'Vehicle creation template.' })
  create(): never {
    return this.vehiclesService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle (template)' })
  @ApiOkResponse({ description: 'Vehicle update template.' })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  update(): never {
    return this.vehiclesService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle (template)' })
  @ApiOkResponse({ description: 'Vehicle deletion template.' })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  remove(): never {
    return this.vehiclesService.remove();
  }
}
