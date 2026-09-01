import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username or email address.' })
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty({ description: 'User password.', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
