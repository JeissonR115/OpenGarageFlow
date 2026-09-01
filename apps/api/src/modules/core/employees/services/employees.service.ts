import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeesRepository } from '../repositories/employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async findAll() {
    return this.employeesRepository.findAll();
  }

  async findById(id: string) {
    const employee = await this.employeesRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} was not found.`);
    }

    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      await this.ensureBranchExists(createEmployeeDto.branchId);
      return await this.employeesRepository.create(createEmployeeDto);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      await this.findById(id);

      if (updateEmployeeDto.branchId) {
        await this.ensureBranchExists(updateEmployeeDto.branchId);
      }

      return await this.employeesRepository.update(id, updateEmployeeDto);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findById(id);
      return await this.employeesRepository.deactivate(id);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private async ensureBranchExists(branchId: string) {
    const branch = await this.employeesRepository.findBranchById(branchId);
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} was not found.`);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new ConflictException('The branch relationship is no longer valid.');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Employee was not found.');
      }
    }

    throw error;
  }
}
