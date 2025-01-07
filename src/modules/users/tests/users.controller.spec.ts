import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
  } as Partial<User> as User;

  const mockUsersService = {
    getUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const result = await controller.getUser('1');

      expect(result).toEqual(mockUser);
      expect(service.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    const updateUserDto = {
      name: 'Updated Name',
      password: 'newpassword123',
    };

    it('should update user successfully', async () => {
      const result = await controller.updateUser(1, updateUserDto);

      expect(result).toBe(true);
      expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });
});
