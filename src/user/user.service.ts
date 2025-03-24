import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const userCreator = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!userCreator) notFound(`User`, userId);

      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { username: createUserDto.username },
            {
              AND: [
                { firstName: createUserDto.firstName },
                { middleName: createUserDto.middleName },
                { lastName: createUserDto.lastName },
              ],
            },
          ],
        },
      });

      if (user)
        throw new BadRequestException(
          `User with the username ${createUserDto.username} found.`,
        );

      await this.prismaService.user.create({
        data: createUserDto,
      });

      return {
        message: 'User created successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUsers(query: FindAllDto) {
    try {
      console.log(query);
      return `This action returns all user`;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUserById(userId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
        },
      });

      if (!user) notFound(`User`, userId);

      return {
        message: `User with the id ${userId} found.`,
        user,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUserQuestionAndAnswerById(userId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        include: { secretQuestion: { select: { question: true } } },
      });

      if (!user) notFound(`User`, userId);

      if (!user.secretQuestionId) {
        return {
          message: 'User does not have a secret yet.',
          secret: 'none',
        };
      }

      return {
        message: 'User secrets loaded successfully.',
        secret: {
          question: user.secretQuestion.question || null,
          answer: user.secretAnswer || null,
        },
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUserTicketsByUserId(userId: number, query: FindAllDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!user) notFound('User', userId);

      const { search, offset, limit } = query;

      const where: Prisma.TicketWhereInput = {
        issuerId: userId,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const tickets = await this.prismaService.ticket.findMany({
        where,
        include: {
          serviceReports: true,
          comments: true,
          activities: true,
          assignedUser: {
            select: { firstName: true, lastName: true, department: true },
          },
          issuer: {
            select: { firstName: true, lastName: true, department: true },
          },
          category: true,
          department: true,
          priorityLevel: true,
          status: true,
        },
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.ticket.count({ where });

      return {
        message: `Tickets of the user with the id ${userId} loaded successfully.`,
        tickets,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateUserById(
    userId: number,
    updateUserDto: UpdateUserDto,
    accessToken: string,
  ) {
    try {
      const updaterId = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: updaterId } }),
        this.prismaService.user.findFirst({ where: { id: userId } }),
      ]);

      if (!updater) notFound(`User`, updaterId);
      if (!user) notFound(`User`, userId);

      await this.prismaService.user.update({
        where: { id: userId },
        data: updateUserDto,
      });

      return {
        message: `User with the id ${userId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    userId: number,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { id },
        }),
        this.prismaService.user.findFirst({
          where: { id: userId },
        }),
      ]);

      if (!updater) notFound(`User`, id);
      if (!user) notFound(`User`, userId);

      const passwordsMatched = await argon.verify(user.password, oldPassword);

      if (!passwordsMatched)
        throw new BadRequestException('You entered an incorrect password.');

      const newHashedPassword = await argon.hash(newPassword);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: newHashedPassword },
      });

      return {
        message: `Password of the user with the id ${userId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async updateUserSecretById(
    userId: number,
    questionId: number,
    answer: string,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      const [updater, user] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id } }),
        this.prismaService.user.findFirst({ where: { id: userId } }),
      ]);

      if (!updater) notFound(`User`, id);
      if (!user) notFound(`User`, userId);

      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: { secretQuestionId: questionId, secretAnswer: answer },
      });

      const question = await this.prismaService.secretQuestion.findFirst({
        where: { id: questionId },
      });

      if (!question) notFound(`Question`, questionId);

      return {
        message: `User with the id ${userId} secret updated successfully.`,
        secrets: {
          question: question.question,
          answer: updatedUser.secretAnswer,
        },
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async softRemoveUserById(userId: number, accessToken: string) {
    try {
      console.log(accessToken);
      return `This action removes a #${userId} user`;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async removeUserById(userId: number, accessToken: string) {
    try {
      console.log(accessToken);
      return `This action removes a #${userId} user`;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async verifyUserPasswordById(
    userId: number,
    password: string,
    accessToken: string,
  ) {
    try {
      const id = extractUserId(accessToken, this.jwtService);

      if (userId !== id) throw new BadRequestException(`Ids mismatch.`);

      const user = await this.prismaService.user.findFirst({
        where: { id },
      });

      const passwordValid = await argon.verify(user.password, password);

      if (!passwordValid)
        throw new BadRequestException(`Password is incorrect.`);

      return {
        message: 'User is verified',
        userId: id,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
