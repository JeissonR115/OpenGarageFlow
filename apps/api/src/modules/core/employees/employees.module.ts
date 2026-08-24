import { Module } from '@nestjs/common';

import { EmployeesController } from './controllers/employees.controller';
import { EmployeesRepository } from './repositories/employees.repository';
import { EmployeesService } from './services/employees.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
