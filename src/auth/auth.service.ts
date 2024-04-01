import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshDTO, UserDTO } from './auth.dto';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: User) {
    const user = await this.userService.getSingleUserByLogin(body.login);

    if (!user) {
      throw new UnauthorizedException(
        'User login is incorrect or user does not exist.',
      );
    }

    const isValidPassword = await bcrypt.compare(body.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const tokens = await this.generateTokensPair(user.id, user.login);

    return { ...user, ...tokens };
  }

  async signup(body: UserDTO) {
    const hashPassword = bcrypt.hashSync(
      body.password,
      Number(process.env.CRYPT_SALT),
    );

    const user = await this.userService.createUser({
      ...body,
      password: hashPassword,
    });

    const tokens = await this.generateTokensPair(user.id, user.login);

    return { ...user, ...tokens };
  }

  async generateNewRefreshToken(req: RefreshDTO) {
    if (!req.refreshToken) {
      throw new HttpException('Token is not provided.', 401);
    }

    try {
      const body = this.jwtService.verify(req.refreshToken);

      if (!body) {
        throw new ForbiddenException('Token is invalid or has been expired.');
      }

      const user = this.userService.getSingleUser(body.userId);

      return await this.generateTokensPair((await user).id, (await user).login);
    } catch (error) {
      throw new ForbiddenException('Token is invalid or has been expired.');
    }
  }

  async generateTokensPair(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        {
          userId,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_KEY,
        },
        { login },
      ),
      this.signToken(
        {
          userId,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
        { login },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async signToken(
    {
      userId,
      expiresIn,
      secret,
    }: { userId: string; expiresIn: string; secret: string },
    payload,
  ) {
    return await this.jwtService.signAsync(
      {
        userId,
        ...payload,
      },
      {
        secret,
        expiresIn,
      },
    );
  }
}
