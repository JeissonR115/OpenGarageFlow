import { Module } from '@nestjs/common';

import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [CustomersModule, VehiclesModule],
})
export class CrmModule {}
