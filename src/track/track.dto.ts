import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateTrackDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}

export class UpdateTrackDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @IsOptional()
  @IsInt()
  duration: number;
}
