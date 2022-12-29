import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import congfigurations from '@config/index';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { HelperModule } from './helpers/helpers.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [congfigurations],
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().required(),
        PORT: Joi.number().default(4500),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRTY_D: Joi.string().default('30d'),
      }),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      retryAttempts: 3,
    }),
    UserModule,
    AuthModule,
    HelperModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
