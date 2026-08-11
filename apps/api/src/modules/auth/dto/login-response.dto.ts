import { ApiProperty } from '@nestjs/swagger';

export class AuthEmployeeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ nullable: true })
  email!: string | null;
}

export class AuthRoleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ type: () => AuthEmployeeResponseDto })
  employee!: AuthEmployeeResponseDto;

  @ApiProperty({ type: () => AuthRoleResponseDto, isArray: true })
  roles!: AuthRoleResponseDto[];
}
