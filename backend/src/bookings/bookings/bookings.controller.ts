import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('bookings')
@ApiBearerAuth('access-token')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Creer une reservation (tout utilisateur connecte)' })
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @ApiOperation({
    summary:
      'Lister les reservations (les siennes pour un client, toutes pour admin/manager)',
  })
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail d une reservation' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Changer le statut d une reservation - ADMIN/MANAGER',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.updateStatus(id, dto, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Annuler sa propre reservation' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.bookingsService.cancel(id, user);
  }
}
