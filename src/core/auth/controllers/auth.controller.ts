import { Body, Req, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { LocalAuthenticationGuard } from '../guards/local-auth.guard';
 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
 
  @HttpCode(200)
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    return this.authenticationService.logIn(request.user)
  }
}