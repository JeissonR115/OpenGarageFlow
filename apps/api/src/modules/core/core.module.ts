import { Module } from '@nestjs/common';

import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CompaniesModule, EmployeesModule, RolesModule, UsersModule],
})
export class CoreModule {}
