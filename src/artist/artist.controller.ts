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
import { Artist } from 'src/types';
import { CreateArtistDTO, UpdateArtistDTO } from './artist.dto';
import { ArtistService } from './artist.service';

@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getSingleUser(@Param('id', ParseUUIDPipe) id: string): Promise<Artist> {
    return this.artistService.getSingleArtist(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArtist(@Body() body: CreateArtistDTO) {
    return this.artistService.createArtist(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.deleteArtist(id);
  }

  @Put(':id')
  async updateArtist(
    @Body() body: UpdateArtistDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Artist> {
    return this.artistService.updateArtist(body, id);
  }
}
