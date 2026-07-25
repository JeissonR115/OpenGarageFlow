import { Injectable, NotFoundException } from '@nestjs/common';

import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async validateUser(identifier: string, _password: string) {
    const user = await this.authRepository.findByIdentifier(identifier);

    if (!user) {
      throw new NotFoundException('User was not found.');
    }
    console.log('password', _password);

    return {
      id: user.id,
      username: user.username,
      employee: user.employee,
      roles: user.roles.map(({ role }) => role),
    };
  }
}
