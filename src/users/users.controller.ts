import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilterUserDTO } from './dto';
import { User, UserPayload } from './entitities';
import { UserService } from './users.service';
import { CurrentUser } from '@core/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUsers(@Query() filters: FilterUserDTO) {
    return this.userService.getUsers(filters);
  }

  @Get(':id')
  async getUser(@Param() id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  async update(
    @CurrentUser() user: UserPayload,
    @Body() payload: Partial<User>,
  ) {
    return this.userService.update(user, payload);
  }
}
