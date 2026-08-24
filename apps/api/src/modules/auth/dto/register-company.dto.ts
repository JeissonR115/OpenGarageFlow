import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  legalName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyPhone?: string;

  @ApiPropertyOptional({ format: 'email' })
  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branchName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branchPhone?: string;

  @ApiPropertyOptional({ format: 'email' })
  @IsOptional()
  @IsEmail()
  branchEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ format: 'email' })
  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminPhone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ writeOnly: true, minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
