import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { CreateArtistDTO, UpdateArtistDTO } from './artist.dto';
import { Artist } from 'src/types';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAllArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async getSingleArtist(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new HttpException('Artist does not exist.', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async createArtist(body: CreateArtistDTO): Promise<Artist> {
    return await this.prisma.artist.create({
      data: {
        ...body,
        id: uuidv4(),
      },
    });
  }

  async deleteArtist(id: string) {
    await this.getSingleArtist(id);

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.favoriteArtist.deleteMany({ where: { artistId: id } });

    await this.prisma.artist.delete({
      where: { id },
    });
  }

  async updateArtist(body: UpdateArtistDTO, id: string): Promise<Artist> {
    const artist = await this.getSingleArtist(id);

    const updateArtist = await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        ...artist,
        ...body,
      },
    });

    return updateArtist;
  }
}
