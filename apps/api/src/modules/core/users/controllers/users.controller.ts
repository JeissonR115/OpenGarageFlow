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

import { CreateUserWithEmployeeDto } from '../dto/create-user-with-employee.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('core/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created successfully.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiConflictResponse({ description: 'Username, employee or role validation failed.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('with-employee')
  @ApiOperation({ summary: 'Create an employee and associated user' })
  @ApiCreatedResponse({
    description: 'Employee and user created successfully.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiConflictResponse({ description: 'Username or relationship is already in use.' })
  @ApiNotFoundResponse({ description: 'Branch or one or more active roles were not found.' })
  async createWithEmployee(@Body() createUserWithEmployeeDto: CreateUserWithEmployeeDto) {
    return this.usersService.createWithEmployee(createUserWithEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'Users retrieved successfully.',
    type: UserResponseDto,
    isArray: true,
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User retrieved successfully.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID.' })
  @ApiNotFoundResponse({ description: 'User was not found.' })
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ description: 'User updated successfully.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID or request data.' })
  @ApiConflictResponse({ description: 'Username, employee or role validation failed.' })
  @ApiNotFoundResponse({ description: 'User was not found.' })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiOkResponse({ description: 'User deactivated successfully.', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID.' })
  @ApiNotFoundResponse({ description: 'User was not found.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
