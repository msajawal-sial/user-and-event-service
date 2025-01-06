import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../database/postgres-error-codes.enum';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/users/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService
    ) {}
   
    public async register(registrationData: RegisterDto) {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);
      try {
        const createdUser = await this.usersService.create({
          ...registrationData,
          password: hashedPassword
        });
        createdUser.password = undefined;
        return createdUser;
      } catch (error) {
        if (error?.code === PostgresErrorCode.UniqueViolation) {
          throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
          const user = await this.usersService.getByEmail(email);
          this.verifyPassword(plainTextPassword, user.password);
          user.password = undefined;
          return user;
        } catch (error) {
          throw new UnauthorizedException('Wrong credentials provided');
        }
    }

    public async logIn(user: User) {
      const payload: TokenPayload = { sub: user.id, name: user.name, email: user.email };
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
      };
    }
    
    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
          throw new UnauthorizedException('Wrong credentials provided');
        }
    }
}
