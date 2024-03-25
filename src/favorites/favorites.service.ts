import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavorites() {
    return {
      artists: await this.prisma.artist.findMany({
        where: {
          FavoriteArtist: {
            some: {},
          },
        },
      }),
      albums: await this.prisma.album.findMany({
        where: {
          FavoriteAlbum: {
            some: {},
          },
        },
      }),
      tracks: await this.prisma.track.findMany({
        where: {
          FavoriteTrack: {
            some: {},
          },
        },
      }),
    };
  }

  async addToFavorite(entity: string, entityId: string) {
    const normalizeEntityName = `${entity[0].toUpperCase()}${entity.slice(1)}`;
    const entityIdName = `${entity}Id`;
    const favoriteReference = `favorite${normalizeEntityName}`;

    const doesEntityExist = await this.prisma[normalizeEntityName].findUnique({
      where: { id: entityId },
    });

    if (!doesEntityExist) {
      throw new HttpException(
        `${normalizeEntityName} does not exist.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma[favoriteReference].create({
      data: { [entityIdName]: entityId },
    });
  }

  async deleteFromFavorite(entity, entityId) {
    const normalizeEntityName = `${entity[0].toUpperCase()}${entity.slice(1)}`;
    const entityIdName = `${entity}Id`;
    const favoriteReference = `favorite${normalizeEntityName}`;

    const doesFavoriteEntityExist = await this.prisma[
      normalizeEntityName
    ].findUnique({
      where: { id: entityId },
    });

    if (!doesFavoriteEntityExist) {
      throw new HttpException(
        `${normalizeEntityName} does not exist on favorites.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma[favoriteReference].delete({
      where: { [entityIdName]: entityId },
    });
  }
}
