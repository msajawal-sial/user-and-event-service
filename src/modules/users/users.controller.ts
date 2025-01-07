import { Controller, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { UserIdGuard } from './guards/user-id.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<User> {
    return this.usersService.getById(id);
  }

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Patch(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update(id, updateUserDto);
  }
} 