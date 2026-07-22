import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Laisser un avis sur un vehicule deja reserve' })
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: User) {
    return this.reviewsService.create(dto, user);
  }

  @Public()
  @Get('car/:carId')
  @ApiOperation({ summary: 'Lister les avis d un vehicule (public)' })
  findByCar(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.reviewsService.findByCar(carId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Supprimer son propre avis' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user);
  }
}
