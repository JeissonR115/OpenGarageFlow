import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterCompanyDto } from '../dto/register-company.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    const existingCompany = await this.authRepository.findCompanyByTaxId(dto.taxId);
    if (existingCompany) {
      throw new ConflictException(`Tax ID ${dto.taxId} is already registered.`);
    }

    const existingUser = await this.authRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException(`Username ${dto.username} is already taken.`);
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    try {
      const user = await this.authRepository.registerCompany(dto, passwordHash);
      return this.toLoginResponse(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'COMPANY_ADMIN role is not available.') {
        throw new NotFoundException('The active COMPANY_ADMIN role was not found.');
      }
      if (this.authRepository.isUniqueConstraintError(error)) {
        throw new ConflictException('Company tax ID or username is already registered.');
      }
      throw error;
    }
  }

  async login(identifier: string, password: string) {
    const user = await this.authRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.passwordService.verify(user.passwordHash, password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.authRepository.updateLastLogin(user.id);

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, username: user.username }),
      user: { id: user.id, username: user.username },
    };
  }

  async getContext(userId: string) {
    const user = await this.authRepository.findContextByUserId(userId);
    if (!user) {
      throw new NotFoundException('Authenticated user was not found.');
    }

    return {
      user: { id: user.id, username: user.username },
      employee: user.employee,
      branch: user.employee.branch,
      company: user.employee.branch.company,
      roles: user.roles.map(({ role }) => role),
    };
  }

  private toLoginResponse(user: { id: string; username: string }) {
    return {
      accessToken: this.jwtService.sign({ sub: user.id, username: user.username }),
      user: { id: user.id, username: user.username },
    };
  }
}
