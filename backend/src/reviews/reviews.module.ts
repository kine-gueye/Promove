import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Booking]), CarsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
