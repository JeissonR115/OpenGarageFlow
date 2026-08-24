import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findAll() {
    return this.rolesRepository.findAll();
  }

  async findById(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} was not found.`);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const existingRole = await this.rolesRepository.findByName(createRoleDto.name);
      if (existingRole) {
        throw new ConflictException(`Role name ${createRoleDto.name} is already in use.`);
      }

      return await this.rolesRepository.create(createRoleDto);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findById(id);

      if (updateRoleDto.name) {
        const existingRole = await this.rolesRepository.findByName(updateRoleDto.name);
        if (existingRole && existingRole.id !== id) {
          throw new ConflictException(`Role name ${updateRoleDto.name} is already in use.`);
        }
      }

      return await this.rolesRepository.update(id, updateRoleDto);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findById(id);
      return await this.rolesRepository.deactivate(id);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Role name is already in use.');
      }

      if (error.code === 'P2003') {
        throw new ConflictException('The role has an invalid relationship.');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Role was not found.');
      }
    }

    throw error;
  }
}
