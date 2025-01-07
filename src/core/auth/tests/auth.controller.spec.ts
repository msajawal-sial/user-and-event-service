import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../../modules/users/entities/user.entity';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
  } as Partial<User> as User;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockUser),
    logIn: jest.fn().mockResolvedValue({ access_token: 'mock.jwt.token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    it('should create a new user', async () => {
      const result = await controller.register(registerDto);
      
      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('logIn', () => {
    it('should return access token', async () => {
      const request = {
        user: mockUser
      } as RequestWithUser;

      const result = await controller.logIn(request);
      
      expect(result).toEqual({ access_token: 'mock.jwt.token' });
      expect(authService.logIn).toHaveBeenCalledWith(mockUser);
    });
  });
}); 