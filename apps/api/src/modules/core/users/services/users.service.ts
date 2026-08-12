import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';

import { PasswordService } from '../../../auth/services/password.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found.`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { username, password, employeeId, roleIds } = createUserDto;

      const existingUserByUsername = await this.usersRepository.findByUsername(username);
      if (existingUserByUsername) {
        throw new ConflictException(`Username ${username} is already taken.`);
      }

      const employee = await this.usersRepository.findEmployeeById(employeeId);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} was not found.`);
      }

      const existingUserByEmployee = await this.usersRepository.findByEmployeeId(employeeId);
      if (existingUserByEmployee) {
        throw new ConflictException(`Employee with ID ${employeeId} already has a user.`);
      }

      const roles = await this.usersRepository.findRolesByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new NotFoundException('One or more roles were not found.');
      }

      const passwordHash = await this.passwordService.hash(password);

      return this.usersRepository.createUser(
        {
          username,
          passwordHash,
          employeeId,
          active: true,
          lastLogin: null,
        },
        roleIds,
      );
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.usersRepository.findByIdWithPassword(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} was not found.`);
      }

      if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
        const duplicate = await this.usersRepository.findByUsername(updateUserDto.username);
        if (duplicate && duplicate.id !== id) {
          throw new ConflictException(`Username ${updateUserDto.username} is already taken.`);
        }
      }

      if (updateUserDto.employeeId && updateUserDto.employeeId !== existingUser.employeeId) {
        const employee = await this.usersRepository.findEmployeeById(updateUserDto.employeeId);
        if (!employee) {
          throw new NotFoundException(
            `Employee with ID ${updateUserDto.employeeId} was not found.`,
          );
        }

        const userByEmployee = await this.usersRepository.findByEmployeeId(
          updateUserDto.employeeId,
        );
        if (userByEmployee && userByEmployee.id !== id) {
          throw new ConflictException(
            `Employee with ID ${updateUserDto.employeeId} already has a user.`,
          );
        }
      }

      if (updateUserDto.roleIds) {
        const roles = await this.usersRepository.findRolesByIds(updateUserDto.roleIds);
        if (roles.length !== updateUserDto.roleIds.length) {
          throw new NotFoundException('One or more roles were not found.');
        }
      }

      const passwordHash =
        updateUserDto.password === undefined
          ? undefined
          : await this.passwordService.hash(updateUserDto.password);

      return this.usersRepository.updateUser(
        id,
        {
          username: updateUserDto.username ?? existingUser.username,
          employeeId: updateUserDto.employeeId ?? existingUser.employeeId,
          active: updateUserDto.active ?? existingUser.active,
          ...(passwordHash ? { passwordHash } : {}),
        },
        updateUserDto.roleIds,
      );
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username or employee is already assigned to another user.');
      }

      if (error.code === 'P2003') {
        throw new ConflictException('The employee or roles relationship is no longer valid.');
      }
    }

    throw error;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found.`);
    }

    return this.usersRepository.deactivateUser(id);
  }
}
