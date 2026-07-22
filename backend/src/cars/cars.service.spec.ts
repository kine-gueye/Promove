import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';

describe('CarsService', () => {
  let service: CarsService;

  // Faux repository TypeORM : evite d'avoir besoin d'une vraie base de donnees
  const mockCarRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((car) => Promise.resolve({ id: 'uuid-1', ...car })),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        { provide: getRepositoryToken(Car), useValue: mockCarRepository },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('doit etre defini', () => {
    expect(service).toBeDefined();
  });

  it('doit creer un vehicule avec les donnees fournies', async () => {
    const dto = {
      brand: 'Toyota',
      model: 'Prado',
      year: 2024,
      category: 'suv' as any,
      seats: 2,
      pricePerDay: 3800,
    };

    const result = await service.create(dto as any);

    expect(mockCarRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expect.objectContaining({ brand: 'Toyota' }));
  });

  it('doit lever une NotFoundException si le vehicule n existe pas', async () => {
    mockCarRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('id-inexistant')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('doit retourner le vehicule quand il existe', async () => {
    const car = { id: 'uuid-1', brand: 'Porsche', model: '911 GT3 RS' };
    mockCarRepository.findOne.mockResolvedValue(car);

    const result = await service.findOne('uuid-1');

    expect(result).toEqual(car);
  });
});
