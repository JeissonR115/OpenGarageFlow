import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

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
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
        throw new NotFoundException(`Employee with ID ${updateUserDto.employeeId} was not found.`);
      }

      const userByEmployee = await this.usersRepository.findByEmployeeId(updateUserDto.employeeId);
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

    let passwordHash = existingUser.passwordHash;
    if (updateUserDto.password !== undefined && updateUserDto.password !== '') {
      passwordHash = await this.passwordService.hash(updateUserDto.password);
    }

    const updateData = {
      username: updateUserDto.username ?? existingUser.username,
      employeeId: updateUserDto.employeeId ?? existingUser.employeeId,
      active: updateUserDto.active ?? existingUser.active,
      ...(updateUserDto.password !== undefined ? { passwordHash } : {}),
    };

    if (updateUserDto.password === undefined || updateUserDto.password === '') {
      delete updateData.passwordHash;
    }

    return this.usersRepository.updateUser(id, updateData, updateUserDto.roleIds);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found.`);
    }

    return this.usersRepository.deactivateUser(id);
  }
}
