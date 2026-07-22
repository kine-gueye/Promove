import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn((user) => Promise.resolve({ id: 'uuid-1', ...user })),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('doit etre defini', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('doit lever une ConflictException si l email existe deja', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'uuid-existant' });

      await expect(
        service.create({
          email: 'existe@promove.sn',
          password: 'MotDePasse123!',
          firstName: 'Awa',
          lastName: 'Diop',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('doit hasher le mot de passe avant de sauvegarder', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.create({
        email: 'nouveau@promove.sn',
        password: 'MotDePasse123!',
        firstName: 'Awa',
        lastName: 'Diop',
      });

      expect(result.password).not.toBe('MotDePasse123!');
      expect(result.email).toBe('nouveau@promove.sn');
    });
  });

  describe('findOne', () => {
    it('doit lever une NotFoundException si l utilisateur n existe pas', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id-inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('doit retourner l utilisateur quand il existe', async () => {
      const user = { id: 'uuid-1', email: 'admin@promove.sn', role: Role.ADMIN };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(user);
    });
  });
});
