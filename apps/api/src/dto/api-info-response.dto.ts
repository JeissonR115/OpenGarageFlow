import { ApiProperty } from '@nestjs/swagger';

export class ApiInfoResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  version!: string;

  @ApiProperty({ enum: ['running'] })
  status!: 'running';

  @ApiProperty()
  documentation!: string;

  @ApiProperty()
  baseUrl!: string;

  @ApiProperty({
    additionalProperties: { type: 'array', items: { type: 'string' } },
    type: 'object',
  })
  domains!: Record<string, string[]>;
}
