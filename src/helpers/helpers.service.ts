import { Injectable } from '@nestjs/common';
import { User } from '@users/entitities';

@Injectable()
export class HelperService {
  formatUser(user: User): Omit<User, 'password'> {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      country: user.country,
      score: user.score,
      role: user.role,
    };
  }
}
