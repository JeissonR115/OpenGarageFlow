import { ApiProperty } from '@nestjs/swagger';

export class VehicleBrandResponseDto {
  @ApiProperty()
  name!: string;
}

export class VehicleModelResponseDto {
  @ApiProperty()
  name!: string;
}

export class VehicleCustomerResponseDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;
}

export class VehicleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  plate!: string;

  @ApiProperty({ nullable: true })
  color!: string | null;

  @ApiProperty({ nullable: true })
  year!: number | null;

  @ApiProperty({ type: () => VehicleBrandResponseDto })
  brand!: VehicleBrandResponseDto;

  @ApiProperty({ type: () => VehicleModelResponseDto })
  model!: VehicleModelResponseDto;

  @ApiProperty({ type: () => VehicleCustomerResponseDto })
  customer!: VehicleCustomerResponseDto;
}
