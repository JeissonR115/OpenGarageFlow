import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { VehicleResponseDto } from '../dto/vehicle-response.dto';
import { VehiclesService } from '../services/vehicles.service';

@ApiTags('Vehicles')
@Controller('crm/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles' })
  @ApiOkResponse({
    description: 'Vehicles retrieved successfully.',
    type: VehicleResponseDto,
    isArray: true,
  })
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiOkResponse({ description: 'Vehicle retrieved successfully.', type: VehicleResponseDto })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  async findById(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a vehicle (template)' })
  @ApiNotImplementedResponse({ description: 'Vehicle creation is not implemented yet.' })
  create(): never {
    return this.vehiclesService.create();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle (template)' })
  @ApiNotImplementedResponse({ description: 'Vehicle update is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  update(): never {
    return this.vehiclesService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle (template)' })
  @ApiNotImplementedResponse({ description: 'Vehicle deletion is not implemented yet.' })
  @ApiNotFoundResponse({ description: 'Vehicle was not found.' })
  remove(): never {
    return this.vehiclesService.remove();
  }
}
