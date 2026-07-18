import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
        legalName: true,
        taxId: true,
        phone: true,
        email: true,
        website: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        legalName: true,
        taxId: true,
        phone: true,
        email: true,
        website: true,
      },
    });
  }
}
