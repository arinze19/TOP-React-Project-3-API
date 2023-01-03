import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
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
  ): Promise<{
    users: User[];
    count: number;
    page: number;
    pages: number;
  }> {
    const options = {
      skip: filters.offset ? +filters.offset : 0,
      limit: filters.limit ? +filters.limit : 10,
    };

    const query = { $or: [filters, ...args] };

    const [count, users] = await Promise.all([
      this.userRepository.countDocuments(query),
      this.userRepository.find(query, {}, options),
    ]);

    return {
      users,
      count,
      page: Math.ceil(options.skip / (count + 1) + 1),
      pages: Math.ceil(count / options.limit),
    };
  }

  async create(payload: CreateUserDTO): Promise<User> {
    /**
     * 409 - Check if user exists and prevent from creating new user if so
     */
    const { users } = await this.getUsers(
      { email: payload.email },
      { username: payload.username },
    );

    if (users.length > 0) {
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
    const user = await this.userRepository.findById(id);

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

  async update(
    currentUser: UserPayload,
    id: string,
    payload: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const uniqueFields = {
      username: payload.username ? payload.username : '',
      email: payload.email ? payload.email : '',
      role: payload.role ? payload.role : '',
    };

    const user = await this.getUserById(id);

    /**
     * 403 - prevent users from manipulating others' record
     */
    if (user._id !== currentUser._id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Forbidden action');
    }

    /**
     * 409 - prevent user from manipulating email & username if they are already in the DB
     */
    if (uniqueFields.username || uniqueFields.email) {
      const { users } = await this.getUsers(
        { username: uniqueFields.username },
        { email: uniqueFields.email },
      );

      if (users.length > 0) {
        throw new ConflictException(
          'This username or email already exists, try another?',
        );
      }
    }

    /**
     * 403 - Prevent user from altering their role
     * TODO: Add Role custom decoractor that allows functionality for only admins
     */
    if (uniqueFields.role) {
      throw new ForbiddenException('Sorry, you cannot alter your role');
    }

    return this.helperService.formatUser(
      await this.userRepository.findOneAndUpdate({ _id: user._id }, payload),
    );
  }
}
