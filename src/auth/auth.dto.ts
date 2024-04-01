import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshDTO {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
