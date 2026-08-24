import { IntersectionType, PickType } from '@nestjs/swagger';

import { CreateEmployeeDto } from '../../employees/dto/create-employee.dto';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithEmployeeDto extends IntersectionType(
  CreateEmployeeDto,
  PickType(CreateUserDto, ['username', 'password', 'roleIds'] as const),
) {}
