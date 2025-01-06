import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/auth.service';
import { UsersModule } from '../../modules/users/users.module';
import { AuthenticationController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../config/jwt.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}