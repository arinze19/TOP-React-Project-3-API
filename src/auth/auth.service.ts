import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '@users/dto';
import { UserService } from '@users/users.service';
import { HelperService } from 'src/helpers/helpers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
  ) {}
  async login(payload: Pick<CreateUserDTO, 'email' | 'password'>) {
    const user = await this.userService.getUser({
      email: payload.email,
    });

    if (!(await bcrypt.compare(payload.password, user.password))) {
      throw new BadRequestException('Username or password not correct');
    }

    const token = await this.generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: this.helperService.formatUser(user),
    };
  }

  async signUp(payload: CreateUserDTO) {
    const user = await this.userService.create(payload);
    const token = await this.generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: this.helperService.formatUser(user),
    };
  }

  async generateToken(payload: Record<string, unknown>): Promise<string> {
    return await this.jwtService.sign(payload);
  }
}
