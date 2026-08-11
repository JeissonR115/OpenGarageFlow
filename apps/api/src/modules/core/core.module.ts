import { Module } from '@nestjs/common';

import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CompaniesModule, UsersModule],
})
export class CoreModule {}
