import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeResponseDto } from '../dto/employee-response.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeesService } from '../services/employees.service';

@ApiTags('Employees')
@Controller('core/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List active employees' })
  @ApiOkResponse({ type: EmployeeResponseDto, isArray: true })
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid employee ID.' })
  @ApiNotFoundResponse({ description: 'Employee was not found.' })
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.employeesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an employee' })
  @ApiCreatedResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiNotFoundResponse({ description: 'Branch was not found.' })
  @ApiConflictResponse({ description: 'The branch relationship is invalid.' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update or reactivate an employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid employee ID or request data.' })
  @ApiNotFoundResponse({ description: 'Employee or branch was not found.' })
  @ApiConflictResponse({ description: 'The branch relationship is invalid.' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid employee ID.' })
  @ApiNotFoundResponse({ description: 'Employee was not found.' })
  @ApiConflictResponse({ description: 'The employee cannot be updated.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.employeesService.remove(id);
  }
}
