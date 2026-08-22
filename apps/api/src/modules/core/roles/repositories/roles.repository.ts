import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';
import { PrismaService } from '../../../../prisma/prisma.service';

const roleSelect = {
  id: true,
  name: true,
  description: true,
  active: true,
  createdAt: true,
} as const;

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({ where: { active: true }, select: roleSelect });
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({ where: { id }, select: roleSelect });
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({ where: { name }, select: { id: true, name: true } });
  }

  async create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data, select: roleSelect });
  }

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({ where: { id }, data, select: roleSelect });
  }

  async deactivate(id: string) {
    return this.prisma.role.update({ where: { id }, data: { active: false }, select: roleSelect });
  }
}
