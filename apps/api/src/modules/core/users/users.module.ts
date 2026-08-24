import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/auth.module';
import { PasswordService } from '../../auth/services/password.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PasswordService],
})
export class UsersModule {}
