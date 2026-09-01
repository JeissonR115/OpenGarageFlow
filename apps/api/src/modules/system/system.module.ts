import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { InfoModule } from './info/info.module';

@Module({
  imports: [HealthModule, InfoModule],
})
export class SystemModule {}
