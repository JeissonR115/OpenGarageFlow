import { ApiProperty } from '@nestjs/swagger';

export class SystemInfoResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  version!: string;

  @ApiProperty()
  environment!: string;

  @ApiProperty()
  uptime!: number;

  @ApiProperty({ format: 'date-time' })
  timestamp!: string;
}
