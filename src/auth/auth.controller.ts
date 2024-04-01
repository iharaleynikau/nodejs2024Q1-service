import { Controller, Body, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { UserDTO, RefreshDTO } from './auth.dto';
import { User } from 'src/types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: User) {
    return this.authService.login(body);
  }

  @Post('/signup')
  signup(@Body() body: UserDTO) {
    return this.authService.signup(body);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshDTO) {
    return this.authService.generateNewRefreshToken(body);
  }
}
