import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { HelperModule } from 'src/helpers/helpers.module';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User, UserSchema } from './entitities/user.schema';
import { UserRepository } from './repositories';

@Module({
  imports: [
    forwardRef(() => AuthModule),
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
  exports: [UserService],
})
export class UserModule {}
