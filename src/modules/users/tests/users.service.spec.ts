import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123'
  } as Partial<User> as User;

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    it('should create a new user', async () => {
      const result = await service.create(createUserDto);
      
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getUser(1);
      
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getUser(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');
      
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getUserByEmail('test@example.com')).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    const updateUserDto = {
      name: 'Updated Name',
      password: 'newpassword123'
    };

    it('should update user successfully', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateUser(1, updateUserDto);
      
      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalled();
    });

    it('should return false if no user was updated', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.updateUser(1, updateUserDto);
      
      expect(result).toBe(false);
    });

    it('should hash password if included in update', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const spy = jest.spyOn(bcrypt, 'hash');

      await service.updateUser(1, updateUserDto);
      
      expect(spy).toHaveBeenCalled();
    });
  });
}); 