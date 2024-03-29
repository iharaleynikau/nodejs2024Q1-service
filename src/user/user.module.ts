import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ExcludePasswordInterceptor } from './exclude.interceptor';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ExcludePasswordInterceptor, PrismaService],
})
export class UserModule {}
