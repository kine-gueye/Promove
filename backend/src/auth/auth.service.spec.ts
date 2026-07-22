import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../users/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'fake-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('doit etre defini', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('doit creer un compte client et renvoyer un token', async () => {
      const hashedPassword = await bcrypt.hash('MotDePasse123!', 10);
      mockUsersService.create.mockResolvedValue({
        id: 'uuid-1',
        email: 'client@promove.sn',
        password: hashedPassword,
        firstName: 'Awa',
        lastName: 'Diop',
        role: Role.CLIENT,
      });

      const result = await service.register({
        email: 'client@promove.sn',
        password: 'MotDePasse123!',
        firstName: 'Awa',
        lastName: 'Diop',
      });

      expect(result.accessToken).toBe('fake-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('client@promove.sn');
    });
  });

  describe('login', () => {
    it("doit lever une UnauthorizedException si l'utilisateur n'existe pas", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'inconnu@promove.sn', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doit lever une UnauthorizedException si le mot de passe est incorrect', async () => {
      const hashedPassword = await bcrypt.hash('BonMotDePasse!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'client@promove.sn',
        password: hashedPassword,
        isActive: true,
        role: Role.CLIENT,
      });

      await expect(
        service.login({ email: 'client@promove.sn', password: 'MauvaisMdp' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doit renvoyer un token si les identifiants sont corrects', async () => {
      const hashedPassword = await bcrypt.hash('BonMotDePasse!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'client@promove.sn',
        password: hashedPassword,
        isActive: true,
        role: Role.CLIENT,
      });

      const result = await service.login({
        email: 'client@promove.sn',
        password: 'BonMotDePasse!',
      });

      expect(result.accessToken).toBe('fake-jwt-token');
    });

    it('doit lever une UnauthorizedException si le compte est desactive', async () => {
      const hashedPassword = await bcrypt.hash('BonMotDePasse!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'client@promove.sn',
        password: hashedPassword,
        isActive: false,
        role: Role.CLIENT,
      });

      await expect(
        service.login({ email: 'client@promove.sn', password: 'BonMotDePasse!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
