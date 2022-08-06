import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredDto } from './dto/auth-cred.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredDto: AuthCredDto): Promise<void> {
    return this.authService.signUp(authCredDto);
  }
}
