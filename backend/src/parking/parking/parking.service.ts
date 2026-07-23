import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSpot } from './entities/parking-spot.entity';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { OccupySpotDto } from './dto/occupy-spot.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingSpot)
    private readonly spotRepository: Repository<ParkingSpot>,
  ) {}

  create(dto: CreateParkingSpotDto): Promise<ParkingSpot> {
    const spot = this.spotRepository.create(dto);
    return this.spotRepository.save(spot);
  }

  findAll(): Promise<ParkingSpot[]> {
    return this.spotRepository.find({ order: { spotNumber: 'ASC' } });
  }

  async findOne(id: string): Promise<ParkingSpot> {
    const spot = await this.spotRepository.findOne({ where: { id } });
    if (!spot) {
      throw new NotFoundException(`Emplacement ${id} introuvable`);
    }
    return spot;
  }

  /** Compte rapide utilise par le bandeau "X Libres / Y Occupées" du dashboard */
  async getStats() {
    const total = await this.spotRepository.count();
    const occupied = await this.spotRepository.count({
      where: { isOccupied: true },
    });
    return { total, occupied, free: total - occupied };
  }

  async occupy(id: string, dto: OccupySpotDto): Promise<ParkingSpot> {
    const spot = await this.findOne(id);
    if (spot.isOccupied) {
      throw new BadRequestException('Cet emplacement est déjà occupé');
    }
    spot.isOccupied = true;
    spot.carPlate = dto.carPlate;
    spot.ownerName = dto.ownerName;
    spot.vehicleModel = dto.vehicleModel ?? null;
    spot.occupiedAt = new Date();
    return this.spotRepository.save(spot);
  }

  async release(id: string): Promise<ParkingSpot> {
    const spot = await this.findOne(id);
    if (!spot.isOccupied) {
      throw new BadRequestException('Cet emplacement est déjà libre');
    }
    spot.isOccupied = false;
    spot.carPlate = null;
    spot.ownerName = null;
    spot.vehicleModel = null;
    spot.occupiedAt = null;
    return this.spotRepository.save(spot);
  }
}
