import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class VehiclesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicle.findMany({
      select: {
        id: true,
        plate: true,
        color: true,
        year: true,
        brand: { select: { name: true } },
        model: { select: { name: true } },
        customer: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      select: {
        id: true,
        plate: true,
        color: true,
        year: true,
        brand: { select: { name: true } },
        model: { select: { name: true } },
        customer: { select: { firstName: true, lastName: true } },
      },
    });
  }
}
