import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { User } from 'src/types';
import { CreateUserDTO, UpdateUserPasswordDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getSingleUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(body: CreateUserDTO): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...body,
        id: uuidv4(),
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
  }

  async deleteUser(id: string) {
    await this.getSingleUser(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updateUser(body: UpdateUserPasswordDTO, id: string): Promise<User> {
    const user = await this.getSingleUser(id);

    if (user.password !== body.oldPassword) {
      throw new HttpException('Old password is wrong.', HttpStatus.FORBIDDEN);
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: body.newPassword,
        version: ++user.version,
        updatedAt: Date.now(),
      },
    });

    return updateUser;
  }
}
