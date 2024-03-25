import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { CreateTrackDTO, UpdateTrackDTO } from './track.dto';
import { Track } from 'src/types';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async getSingleTrack(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new HttpException('Track does not exist.', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async createTrack(body: CreateTrackDTO): Promise<Track> {
    return await this.prisma.track.create({
      data: {
        ...body,
        id: uuidv4(),
      },
    });
  }

  async deleteTrack(id: string) {
    await this.getSingleTrack(id);

    await this.prisma.favoriteTrack.deleteMany({ where: { trackId: id } });

    await this.prisma.track.delete({
      where: { id },
    });
  }

  async updateTrack(body: UpdateTrackDTO, id: string): Promise<Track> {
    const track = await this.getSingleTrack(id);

    const updateTrack = await this.prisma.track.update({
      where: {
        id,
      },
      data: {
        ...track,
        ...body,
      },
    });

    return updateTrack;
  }
}
