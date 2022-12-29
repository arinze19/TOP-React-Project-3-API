import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies';
import { HelperModule } from 'src/helpers/helpers.module';

const jwtFactory = {
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXP_D'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync(jwtFactory),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HelperModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
