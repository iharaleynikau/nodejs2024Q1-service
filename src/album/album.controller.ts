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
} from '@nestjs/common';
import { Album } from 'src/types';
import { CreateAlbumDTO, UpdateAlbumDTO } from './album.dto';
import { AlbumService } from './album.service';

@Controller('/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  async getSingleUser(@Param('id', ParseUUIDPipe) id: string): Promise<Album> {
    return this.albumService.getSingleAlbum(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() body: CreateAlbumDTO) {
    return this.albumService.createAlbum(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletelbumt(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.deleteAlbum(id);
  }

  @Put(':id')
  async updateAlbum(
    @Body() body: UpdateAlbumDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Album> {
    return this.albumService.updateAlbum(body, id);
  }
}
