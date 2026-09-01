import { ApiProperty } from '@nestjs/swagger';

import { EmployeeResponseDto } from '../../employees/dto/employee-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty({ format: 'date-time', nullable: true })
  lastLogin!: Date | null;

  @ApiProperty({ type: () => EmployeeResponseDto })
  employee!: EmployeeResponseDto;

  @ApiProperty({ type: () => RoleResponseDto, isArray: true })
  roles!: RoleResponseDto[];
}
