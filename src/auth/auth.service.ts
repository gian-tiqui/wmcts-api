import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  Register,
  Login,
  Refresh,
  Logout,
  SignToken,
  SignRefreshToken,
} from 'src/utils/types/types';
import errorHandler from 'src/utils/functions/errorHandler';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import notFound from 'src/utils/functions/notFound';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthLogger');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<Register> {
    const { password, ...registerData } = registerDto;
    try {
      const hashedPassword = await argon.hash(password);

      const newUser = await this.prismaService.user.create({
        data: {
          ...registerData,
          password: hashedPassword,
        },
      });

      if (!newUser)
        throw new NotFoundException(`There was a problem in creating a user.`);

      return {
        message: 'User registered successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async login(loginDto: LoginDto): Promise<Login> {
    const { username, password } = loginDto;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { username },
        include: { department: true, roles: true },
      });

      if (!user)
        throw new NotFoundException(
          `User with the username ${username} not found.`,
        );

      const passwordMatch = await argon.verify(user.password, password);

      if (!passwordMatch) {
        this.logger.error(
          `User with the username ${username} entered a wrong password.`,
        );

        throw new BadRequestException(`You have entered the wrong password`);
      }

      const accessToken = await this.signToken(
        user.id,
        user.firstName,
        user.middleName,
        user.lastName,
        user.department.id,
        user.department.name,
        user.department.code,
        user.roles,
      );

      let refreshToken;

      if (user.refreshToken) refreshToken = user.refreshToken;
      else {
        refreshToken = await this.signRefreshToken(user.id);
        await this.prismaService.user.update({
          where: { id: user.id },
          data: { refreshToken },
        });

        return {
          message: 'User tokens loaded successfully.',
          tokens: { accessToken, refreshToken },
        };
      }

      return {
        message: `User tokens of ${user.firstName} ${user.lastName} loaded successfully.`,
        tokens: { accessToken, refreshToken },
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<Refresh> {
    const { refreshToken } = refreshTokenDto;

    try {
      if (!refreshToken)
        throw new BadRequestException(`Refresh token is required.`);

      const user = await this.prismaService.user.findFirst({
        where: { refreshToken },
        include: { department: true, roles: true },
      });

      if (!user) {
        this.logger.error(`Refresh token not found : ${refreshToken}}`);
        throw new NotFoundException(`Refresh token not found`);
      }

      const accessToken = await this.signToken(
        user.id,
        user.firstName,
        user.middleName,
        user.lastName,
        user.department.id,
        user.department.name,
        user.department.code,
        user.roles,
      );

      return {
        message: 'Access token regenerated successfully.',
        accessToken,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async logout(userId: number): Promise<Logout> {
    try {
      const logout = await this.prismaService.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      if (!logout) {
        this.logger.error(
          `There was a problem in logging out the user with the id ${userId}`,
        );
        throw new BadRequestException('There was a problem in logging out.');
      }

      return {
        message: 'Logged out successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  private async signToken(
    userId: number,
    firstName: string,
    middleName: string,
    lastName: string,
    deptId: number,
    deptName: string,
    deptCode: string,
    roles: Role[],
  ): SignToken {
    return this.jwtService.signAsync({
      sub: userId,
      firstName,
      middleName,
      lastName,
      deptId,
      deptName,
      deptCode,
      roles,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          AND: [
            { secretQuestionId: forgotPasswordDto.questionId },
            { secretAnswer: forgotPasswordDto.answer },
            { username: forgotPasswordDto.username },
          ],
        },
      });

      if (!user)
        throw new UnauthorizedException(
          `You have entered the wrong secrets for the user with the username ${forgotPasswordDto.username}`,
        );

      return {
        message: 'You can now reset your password',
        id: user.id,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async changePassword(userId: number, newPassword: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user) notFound(`User`, userId);

    const hashedPassword = await argon.hash(newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: `Password has been reset.`,
    };
  }

  private async signRefreshToken(userId: number): SignRefreshToken {
    const refreshTokenSecret = this.configService.get<string>('RT_SECRET');
    const refreshTokenExpiration = this.configService.get<string>('RT_EXP');

    return this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: refreshTokenExpiration, secret: refreshTokenSecret },
    );
  }
}
