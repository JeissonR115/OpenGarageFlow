import { ApiProperty } from '@nestjs/swagger';

export class AuthContextUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;
}

export class AuthContextEmployeeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ nullable: true })
  email!: string | null;

  @ApiProperty({ nullable: true })
  phone!: string | null;
}

export class AuthContextBranchDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class AuthContextCompanyDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class AuthContextRoleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class AuthContextResponseDto {
  @ApiProperty({ type: () => AuthContextUserDto })
  user!: AuthContextUserDto;

  @ApiProperty({ type: () => AuthContextEmployeeDto })
  employee!: AuthContextEmployeeDto;

  @ApiProperty({ type: () => AuthContextBranchDto })
  branch!: AuthContextBranchDto;

  @ApiProperty({ type: () => AuthContextCompanyDto })
  company!: AuthContextCompanyDto;

  @ApiProperty({ type: () => AuthContextRoleDto, isArray: true })
  roles!: AuthContextRoleDto[];
}
