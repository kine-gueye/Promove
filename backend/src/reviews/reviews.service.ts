import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { CarsService } from '../cars/cars.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly carsService: CarsService,
  ) {}

  async create(dto: CreateReviewDto, currentUser: User): Promise<Review> {
    await this.carsService.findOne(dto.carId); // 404 si le vehicule n'existe pas

    // Seul un client ayant deja reserve ce vehicule peut laisser un avis
    const hasBooked = await this.bookingRepository.findOne({
      where: { carId: dto.carId, userId: currentUser.id },
    });
    if (!hasBooked) {
      throw new ForbiddenException(
        "Vous devez avoir reserve ce vehicule pour pouvoir laisser un avis",
      );
    }

    const review = this.reviewRepository.create({
      ...dto,
      userId: currentUser.id,
    });
    return this.reviewRepository.save(review);
  }

  findByCar(carId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { carId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Avis ${id} introuvable`);
    }
    if (review.userId !== currentUser.id) {
      throw new ForbiddenException(
        "Vous ne pouvez supprimer que vos propres avis",
      );
    }
    await this.reviewRepository.remove(review);
  }
}
