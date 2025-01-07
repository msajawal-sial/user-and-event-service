import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../modules/users/entities/user.entity';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let mockUser: User;

  beforeAll(async () => {
    mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      password: await bcrypt.hash('password123', 10)
    } as Partial<User> as User;
  });

  const mockUsersService = {
    create: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    it('should successfully register a new user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      mockUsersService.create.mockRejectedValue({ code: '23505' }); // PostgresErrorCode.UniqueViolation

      await expect(service.register(registerDto)).rejects.toThrow(HttpException);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should return user if credentials are valid', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      
      const result = await service.getAuthenticatedUser('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      mockUsersService.getUserByEmail.mockRejectedValue(new Error());

      await expect(
        service.getAuthenticatedUser('wrong@email.com', 'password123')
      ).rejects.toThrow();
    });
  });

  describe('logIn', () => {
    it('should return access token', async () => {
      const result = await service.logIn(mockUser);

      expect(result).toEqual({ access_token: 'mock.jwt.token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
    });
  });
}); 