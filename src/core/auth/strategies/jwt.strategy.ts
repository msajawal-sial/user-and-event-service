import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../../config/jwt.config';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { User } from '../../../modules/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = new User();
    user.id = payload.sub;
    user.name = payload.name;
    user.email = payload.email;
    return user;
  }
}