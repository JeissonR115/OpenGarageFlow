import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username for the user.' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'User password.', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    description: 'ID of the employee associated with the user.',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({
    description: 'IDs of the roles assigned to the user.',
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  roleIds!: string[];
}
