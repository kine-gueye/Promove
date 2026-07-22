import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { CarsService } from '../cars/cars.service';
import { BookingStatus } from './enums/booking-status.enum';
import { Role } from '../users/enums/role.enum';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockBookingRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((booking) => Promise.resolve({ id: 'booking-uuid', ...booking })),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
  };

  const mockCarsService = {
    findAvailable: jest.fn(),
  };

  const fakeClient = {
    id: 'user-uuid',
    role: Role.CLIENT,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepository },
        { provide: CarsService, useValue: mockCarsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('doit etre defini', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('doit rejeter si la date de retour precede la date de prise en charge', async () => {
      await expect(
        service.create(
          {
            carId: 'car-uuid',
            startDate: '2026-08-15',
            endDate: '2026-08-10',
            pickupLocation: 'Dakar',
          },
          fakeClient,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('doit calculer le prix total en fonction du nombre de jours', async () => {
      mockCarsService.findAvailable.mockResolvedValue({
        id: 'car-uuid',
        pricePerDay: 50000,
        currency: 'XOF',
      });
      mockQueryBuilder.getOne.mockResolvedValue(null); // pas de chevauchement

      const result = await service.create(
        {
          carId: 'car-uuid',
          startDate: '2026-08-10',
          endDate: '2026-08-13', // 3 jours
          pickupLocation: 'Dakar',
        },
        fakeClient,
      );

      expect(result.totalPrice).toBe(150000);
      expect(result.currency).toBe('XOF');
    });

    it('doit rejeter si le vehicule est deja reserve sur cette periode', async () => {
      mockCarsService.findAvailable.mockResolvedValue({
        id: 'car-uuid',
        pricePerDay: 50000,
        currency: 'XOF',
      });
      mockQueryBuilder.getOne.mockResolvedValue({ id: 'reservation-existante' });

      await expect(
        service.create(
          {
            carId: 'car-uuid',
            startDate: '2026-08-10',
            endDate: '2026-08-13',
            pickupLocation: 'Dakar',
          },
          fakeClient,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('doit rejeter l annulation d une reservation deja terminee', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: 'booking-uuid',
        userId: fakeClient.id,
        status: BookingStatus.COMPLETED,
      });

      await expect(service.cancel('booking-uuid', fakeClient)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
