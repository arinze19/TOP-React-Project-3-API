import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from '@users/dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() credentials: Pick<CreateUserDTO, 'email' | 'password'>) {}

  @Post('signin')
  async signin() {}
}
