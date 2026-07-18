import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';

import { VehiclesRepository } from '../repositories/vehicles.repository';

@Injectable()
export class VehiclesService {
  constructor(private readonly vehiclesRepository: VehiclesRepository) {}

  async findAll() {
    return this.vehiclesRepository.findAll();
  }

  async findById(id: string) {
    const vehicle = await this.vehiclesRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} was not found.`);
    }

    return vehicle;
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
