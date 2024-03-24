import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserPasswordDTO {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
