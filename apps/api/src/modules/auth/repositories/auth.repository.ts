import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../../prisma/generated/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterCompanyDto } from '../dto/register-company.dto';

const contextSelect = {
  id: true,
  username: true,
  employee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      branch: {
        select: {
          id: true,
          name: true,
          company: { select: { id: true, name: true } },
        },
      },
    },
  },
  roles: { select: { role: { select: { id: true, name: true } } } },
} as const;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCompanyByTaxId(taxId: string) {
    return this.prisma.company.findUnique({ where: { taxId }, select: { id: true } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username }, select: { id: true } });
  }

  async findByIdentifier(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        active: true,
        OR: [{ username: identifier }, { employee: { email: identifier } }],
      },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateLastLogin(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { lastLogin: new Date() } });
  }

  async findContextByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId, active: true },
      select: contextSelect,
    });
  }

  async registerCompany(dto: RegisterCompanyDto, passwordHash: string) {
    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { name: 'COMPANY_ADMIN' },
        select: { id: true, active: true },
      });

      if (!role?.active) {
        throw new Error('COMPANY_ADMIN role is not available.');
      }

      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          legalName: dto.legalName,
          taxId: dto.taxId,
          phone: dto.companyPhone,
          email: dto.companyEmail,
          website: dto.website,
        },
      });

      const branch = await tx.branch.create({
        data: {
          companyId: company.id,
          name: dto.branchName,
          phone: dto.branchPhone,
          email: dto.branchEmail,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          country: dto.country,
        },
      });

      const employee = await tx.employee.create({
        data: {
          branchId: branch.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.adminEmail,
          phone: dto.adminPhone,
        },
      });

      const user = await tx.user.create({
        data: {
          employeeId: employee.id,
          username: dto.username,
          passwordHash,
          active: true,
        },
        select: { id: true, username: true },
      });

      await tx.userRole.create({ data: { userId: user.id, roleId: role.id } });
      return user;
    });
  }

  isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }
}
