import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@users/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: Pick<CreateUserDTO, 'email' | 'password'>) {
    return await this.authService.login(payload);
  }

  @Post('sign-up')
  async signUp(@Body() payload: CreateUserDTO) {
    return await this.authService.signUp(payload);
  }
}
