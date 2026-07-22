import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { CarsService } from '../cars/cars.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly carsService: CarsService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    currentUser: User,
  ): Promise<Booking> {
    const { carId, startDate, endDate } = createBookingDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException(
        'La date de retour doit etre posterieure a la date de prise en charge',
      );
    }

    const car = await this.carsService.findAvailable(carId);

    // Empeche de reserver un vehicule deja pris sur une periode qui se chevauche
    const overlapping = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE],
      })
      .andWhere('booking.startDate <= :end AND booking.endDate >= :start', {
        start: startDate,
        end: endDate,
      })
      .getOne();

    if (overlapping) {
      throw new BadRequestException(
        'Ce vehicule est deja reserve sur cette periode',
      );
    }

    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = Number(car.pricePerDay) * days;

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId: currentUser.id,
      totalPrice,
      currency: car.currency,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(currentUser: User): Promise<Booking[]> {
    // Un client ne voit que ses propres reservations, un admin/manager voit tout
    if (currentUser.role === Role.CLIENT) {
      return this.bookingRepository.find({
        where: { userId: currentUser.id },
        relations: ['car'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.bookingRepository.find({
      relations: ['car', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, currentUser: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['car', 'user'],
    });
    if (!booking) {
      throw new NotFoundException(`Reservation ${id} introuvable`);
    }
    this.assertAccess(booking, currentUser);
    return booking;
  }

  async updateStatus(
    id: string,
    dto: UpdateBookingStatusDto,
    currentUser: User,
  ): Promise<Booking> {
    // Seuls admin/manager peuvent changer le statut (route deja protegee par RolesGuard)
    const booking = await this.findOne(id, currentUser);
    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string, currentUser: User): Promise<Booking> {
    const booking = await this.findOne(id, currentUser);

    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cette reservation ne peut plus etre annulee',
      );
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  private assertAccess(booking: Booking, currentUser: User) {
    const isOwner = booking.userId === currentUser.id;
    const isStaff =
      currentUser.role === Role.ADMIN || currentUser.role === Role.MANAGER;

    if (!isOwner && !isStaff) {
      throw new ForbiddenException(
        "Vous n'avez pas acces a cette reservation",
      );
    }
  }
}
