import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';
import { PrismaService } from '../../../../prisma/prisma.service';

const companySelect = {
  id: true,
  name: true,
  legalName: true,
  taxId: true,
  phone: true,
  email: true,
  website: true,
} as const;

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({ select: companySelect });
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({ where: { id }, select: companySelect });
  }

  async create(data: Prisma.CompanyCreateInput) {
    return this.prisma.company.create({ data, select: companySelect });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput) {
    return this.prisma.company.update({ where: { id }, data, select: companySelect });
  }
}
