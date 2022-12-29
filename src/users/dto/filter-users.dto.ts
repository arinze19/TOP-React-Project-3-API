import { IsNumber, IsString, IsOptional } from 'class-validator';

export default class FilterUserDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
