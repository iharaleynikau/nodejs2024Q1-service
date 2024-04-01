import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesResponse } from 'src/types';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favs')
export class FavoritesController {
  constructor(private favoriteService: FavoritesService) {}

  @Get()
  async getAllFavorites(): Promise<FavoritesResponse> {
    return this.favoriteService.getAllFavorites();
  }

  @Post(':entity/:id')
  async addToFavorite(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.favoriteService.addToFavorite(entity, id);
  }

  @Delete(':entity/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFromFavorite(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.favoriteService.deleteFromFavorite(entity, id);
  }
}
