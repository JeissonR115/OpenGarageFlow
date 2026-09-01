import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: () => AuthLoginUserDto })
  user!: AuthLoginUserDto;
}
