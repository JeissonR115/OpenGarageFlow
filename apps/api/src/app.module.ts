import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { CrmModule } from './modules/crm/crm.module';
import { SystemModule } from './modules/system/system.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    DiscoveryModule,
    ConfigurationModule,
    PrismaModule,
    AuthModule,
    CoreModule,
    CrmModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
