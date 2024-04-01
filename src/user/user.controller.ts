import {
  Controller,
  Get,
  Body,
  Post,
  Delete,
  Put,
  HttpCode,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ExcludePasswordInterceptor } from './exclude.interceptor';
import { User } from 'src/types';
import { CreateUserDTO, UpdateUserPasswordDTO } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ExcludePasswordInterceptor)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseInterceptors(ExcludePasswordInterceptor)
  async getSingleUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.getSingleUser(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ExcludePasswordInterceptor)
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUser(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  @UseInterceptors(ExcludePasswordInterceptor)
  async updateUser(
    @Body() body: UpdateUserPasswordDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.userService.updateUser(body, id);
  }
}
