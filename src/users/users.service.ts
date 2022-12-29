import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as shortId from 'short-id';
import { CreateUserDTO, FilterUserDTO } from './dto';
import { User, Role } from './entitities';
import { UserRepository } from './repositories';
import { HelperService } from 'src/helpers/helpers.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperService: HelperService,
  ) {}
  async getUsers(
    filters: FilterUserDTO,
    ...args: Record<string, unknown>[]
  ): Promise<User[]> {
    return await this.userRepository.find({ $or: [filters, ...args] });
  }

  async create(payload: CreateUserDTO): Promise<Omit<User, 'password'>> {
    // check if user exist
    const existingUsers = await this.getUsers(
      { email: payload.email },
      { username: payload.username },
    );

    if (existingUsers.length > 0) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = {
      ...payload,
      _id: shortId.generate(),
      password: hashedPassword,
      role: Role.PLAYER,
    };

    return this.helperService.formatUser(
      await this.userRepository.save<User>(user),
    );
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
