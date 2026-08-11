import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Unique username for the user.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiPropertyOptional({ description: 'New user password.', writeOnly: true })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated employee.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  employeeId?: string;

  @ApiPropertyOptional({
    description: 'IDs of the roles assigned to the user.',
    type: 'array',
    items: { type: 'string', format: 'uuid' },
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  roleIds?: string[];

  @ApiPropertyOptional({ description: 'Whether the user account is active.' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
