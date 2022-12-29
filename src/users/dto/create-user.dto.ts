import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export default class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsNumber()
  score: number;
}
