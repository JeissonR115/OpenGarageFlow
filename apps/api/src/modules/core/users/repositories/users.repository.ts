import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { active: true },
      select: {
        id: true,
        username: true,
        active: true,
        lastLogin: true,
        employee: {
          select: {
            id: true,
            branchId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                active: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return users.map((user) => ({ ...user, roles: user.roles.map(({ role }) => role) }));
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        active: true,
        lastLogin: true,
        employee: {
          select: {
            id: true,
            branchId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                active: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return user ? { ...user, roles: user.roles.map(({ role }) => role) } : null;
  }

  async findByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        employeeId: true,
        active: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
      },
    });
  }

  async findByEmployeeId(employeeId: string) {
    return this.prisma.user.findFirst({
      where: { employeeId },
      select: {
        id: true,
        employeeId: true,
      },
    });
  }

  async findEmployeeById(employeeId: string) {
    return this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
      },
    });
  }

  async findBranchForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, active: true },
      select: { employee: { select: { branch: { select: { id: true } } } } },
    });

    return user?.employee.branch ?? null;
  }

  async findRolesByIds(roleIds: string[]) {
    return this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
      },
      select: {
        id: true,
      },
    });
  }

  async findActiveRolesByIds(roleIds: string[]) {
    return this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
        active: true,
      },
      select: {
        id: true,
      },
    });
  }

  async createUserWithEmployee(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    branchId: string;
    username: string;
    passwordHash: string;
    roleIds: string[];
  }) {
    const createdUser = await this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          branchId: data.branchId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      });

      const user = await tx.user.create({
        data: {
          employeeId: employee.id,
          username: data.username,
          passwordHash: data.passwordHash,
          active: true,
          lastLogin: null,
        },
      });

      await tx.userRole.createMany({
        data: data.roleIds.map((roleId) => ({
          userId: user.id,
          roleId,
        })),
      });

      return tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          active: true,
          lastLogin: true,
          employee: {
            select: {
              id: true,
              branchId: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              active: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  active: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });
    });

    return createdUser
      ? { ...createdUser, roles: createdUser.roles.map(({ role }) => role) }
      : null;
  }

  async createUser(data: Prisma.UserUncheckedCreateInput, roleIds: string[]) {
    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          passwordHash: data.passwordHash,
          employeeId: data.employeeId,
          active: data.active,
          lastLogin: data.lastLogin,
        },
      });

      await tx.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId: user.id,
          roleId,
        })),
      });

      return tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          active: true,
          lastLogin: true,
          employee: {
            select: {
              id: true,
              branchId: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              active: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  active: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });
    });

    return createdUser
      ? { ...createdUser, roles: createdUser.roles.map(({ role }) => role) }
      : null;
  }

  async updateUser(id: string, data: Prisma.UserUncheckedUpdateInput, roleIds?: string[]) {
    if (roleIds) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id },
          data,
        }),
        this.prisma.userRole.deleteMany({
          where: { userId: id },
        }),
        this.prisma.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: id,
            roleId,
          })),
        }),
      ]);
    } else {
      await this.prisma.user.update({
        where: { id },
        data,
      });
    }

    return this.findById(id);
  }

  async deactivateUser(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { active: false },
      select: {
        id: true,
        username: true,
        active: true,
        lastLogin: true,
        employee: {
          select: {
            id: true,
            branchId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                active: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return { ...user, roles: user.roles.map(({ role }) => role) };
  }
}
