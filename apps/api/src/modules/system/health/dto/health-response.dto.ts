import { ApiProperty } from '@nestjs/swagger';

export class DatabaseHealthResponseDto {
  @ApiProperty({ enum: ['ok', 'error'] })
  status!: 'ok' | 'error';

  @ApiProperty({ enum: ['connected', 'disconnected'] })
  database!: 'connected' | 'disconnected';
}

export class HealthResponseDto extends DatabaseHealthResponseDto {
  @ApiProperty({ format: 'date-time' })
  timestamp!: string;
}
