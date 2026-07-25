import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PasswordService],
})
export class AuthModule {}
