import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.authRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.passwordService.verify(user.passwordHash, password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return {
      id: user.id,
      username: user.username,
      employee: user.employee,
      roles: user.roles.map(({ role }) => role),
    };
  }
}
