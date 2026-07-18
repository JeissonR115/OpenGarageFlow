import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';

import { CustomersRepository } from '../repositories/customers.repository';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async findAll() {
    return this.customersRepository.findAll();
  }

  async findById(id: string) {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} was not found.`);
    }

    return customer;
  }

  create(): never {
    throw new NotImplementedException();
  }

  update(): never {
    throw new NotImplementedException();
  }

  remove(): never {
    throw new NotImplementedException();
  }
}
