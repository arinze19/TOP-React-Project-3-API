import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as shortId from 'short-id';
import { HelperService } from 'src/helpers/helpers.service';
import { CreateUserDTO, FilterUserDTO } from './dto';
import { User, Role, UserPayload } from './entitities';
import { UserRepository } from './repositories';

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

  async create(payload: CreateUserDTO): Promise<User> {
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

    return await this.userRepository.save<User>(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUser(payload: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne(payload);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(currentUser: UserPayload, payload: Partial<User>) {
    return this.helperService.formatUser(
      await this.userRepository.findOneAndUpdate(
        { _id: currentUser._id },
        payload,
      ),
    );
  }
}
