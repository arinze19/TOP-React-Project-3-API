import { EntityRepository } from '@core/repositories/entity.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '@users/entitities/user.schema';

@Injectable()
export default class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
