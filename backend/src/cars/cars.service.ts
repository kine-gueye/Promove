import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarFilterDto } from './dto/car-filter.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carRepository.create(createCarDto);
    return this.carRepository.save(car);
  }

  async findAll(filters: CarFilterDto): Promise<Car[]> {
    const query = this.carRepository.createQueryBuilder('car');

    if (filters.category) {
      query.andWhere('car.category = :category', {
        category: filters.category,
      });
    }
    if (filters.brand) {
      query.andWhere('LOWER(car.brand) LIKE LOWER(:brand)', {
        brand: `%${filters.brand}%`,
      });
    }
    if (filters.minPrice !== undefined) {
      query.andWhere('car.pricePerDay >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('car.pricePerDay <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    query.orderBy('car.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!car) {
      throw new NotFoundException(`Vehicule ${id} introuvable`);
    }
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);
    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<void> {
    const car = await this.findOne(id);
    await this.carRepository.remove(car);
  }

  /** Utilise par le module bookings pour verifier la disponibilite */
  async findAvailable(id: string): Promise<Car> {
    const car = await this.findOne(id);
    if (!car.available) {
      throw new NotFoundException(
        `Le vehicule ${car.brand} ${car.model} n'est pas disponible actuellement`,
      );
    }
    return car;
  }
}
