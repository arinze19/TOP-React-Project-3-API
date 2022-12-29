import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO, FilterUserDTO } from './dto';
// import { User } from './entitities';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUsers(@Query() filters: FilterUserDTO) {
    return this.userService.getUsers(filters);
  }

  // @UseGuards(AuthGuard())
  @Post()
  async create(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }

  @Get(':id')
  async getUser(@Param() id: string) {
    return this.userService.getUserById(id);
  }
}
