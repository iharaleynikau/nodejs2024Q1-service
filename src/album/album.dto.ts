import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsUUID('4')
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;
}

export class UpdateAlbumDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}
