import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';

const employeeSelect = {
  id: true,
  branchId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({ where: { active: true }, select: employeeSelect });
  }

  async findById(id: string) {
    return this.prisma.employee.findUnique({ where: { id }, select: employeeSelect });
  }

  async findBranchById(id: string) {
    return this.prisma.branch.findUnique({ where: { id }, select: { id: true } });
  }

  async create(data: {
    branchId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }) {
    return this.prisma.employee.create({ data, select: employeeSelect });
  }

  async update(
    id: string,
    data: {
      branchId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      active?: boolean;
    },
  ) {
    return this.prisma.employee.update({ where: { id }, data, select: employeeSelect });
  }

  async deactivate(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { active: false },
      select: employeeSelect,
    });
  }
}
