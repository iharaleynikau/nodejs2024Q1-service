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
import { Track } from 'src/types';
import { CreateTrackDTO, UpdateTrackDTO } from './track.dto';
import { TrackService } from './track.service';

@Controller('/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks(): Promise<Track[]> {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  async getSingleUser(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.trackService.getSingleTrack(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() body: CreateTrackDTO) {
    return this.trackService.createTrack(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.deleteTrack(id);
  }

  @Put(':id')
  async updateTrack(
    @Body() body: UpdateTrackDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Track> {
    return this.trackService.updateTrack(body, id);
  }
}
