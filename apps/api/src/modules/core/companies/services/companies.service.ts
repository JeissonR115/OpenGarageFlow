import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../../../../prisma/generated/client';

import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompaniesRepository } from '../repositories/companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll() {
    return this.companiesRepository.findAll();
  }

  async findById(id: string) {
    const company = await this.companiesRepository.findById(id);

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} was not found.`);
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto) {
    return this.companiesRepository.create(createCompanyDto);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      await this.findById(id);
      return await this.companiesRepository.update(id, updateCompanyDto);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Company was not found.');
    }

    throw error;
  }
}
