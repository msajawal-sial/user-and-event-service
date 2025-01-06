import { Body, Req, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { LocalAuthGuard } from '../guards/local-auth.guard';
 
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
 
  @HttpCode(200)
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    return this.authService.logIn(request.user)
  }
}