import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
  imports: [AuthModule],
})
export class FavoritesModule {}
