import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { CreateAlbumDTO, UpdateAlbumDTO } from './album.dto';
import { Album } from 'src/types';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getSingleAlbum(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });

    if (!album) {
      throw new HttpException('Album does not exist.', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  async createAlbum(body: CreateAlbumDTO): Promise<Album> {
    return await this.prisma.album.create({
      data: {
        ...body,
        id: uuidv4(),
      },
    });
  }

  async deleteAlbum(id: string) {
    await this.getSingleAlbum(id);

    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await this.prisma.favoriteAlbum.deleteMany({
      where: { albumId: id },
    });

    await this.prisma.album.delete({
      where: { id },
    });
  }

  async updateAlbum(body: UpdateAlbumDTO, id: string): Promise<Album> {
    const album = await this.getSingleAlbum(id);

    const updateAlbum = await this.prisma.album.update({
      where: {
        id,
      },
      data: {
        ...album,
        ...body,
      },
    });

    return updateAlbum;
  }
}
