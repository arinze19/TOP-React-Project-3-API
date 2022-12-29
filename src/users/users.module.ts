import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { HelperModule } from 'src/helpers/helpers.module';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User, UserSchema } from './entitities/user.schema';
import { UserRepository } from './repositories';

@Module({
  imports: [
    AuthModule,
    HelperModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
