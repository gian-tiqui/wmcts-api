import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import notFound from 'src/utils/functions/notFound';
import extractUserId from 'src/utils/functions/extractUserId';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Directory } from 'src/utils/enums/enum';
import generateUniqueSuffix from 'src/utils/functions/generateUniqueSuffix';

@Injectable()
export class CommentService {
  private logger: Logger = new Logger('CommentService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createCommentDto: CreateCommentDto, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, ticket] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.ticket.findFirst({
          where: { id: createCommentDto.ticketId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!ticket) notFound(`Ticket`, createCommentDto.ticketId);

      const newComment = await this.prismaService.comment.create({
        data: { ...createCommentDto, userId },
      });

      return {
        commentId: newComment.id,
        message: 'Comment created successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOne(commentId: number) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: { id: commentId },
      });

      if (!comment) notFound(`Comment`, commentId);

      return {
        message: `Comment with the id ${commentId} loaded successfully.`,
        comment,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async upload(
    commentId: number,
    files: Express.Multer.File[],
    accessToken: string,
  ) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, comment] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.comment.findFirst({ where: { id: commentId } }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!comment) notFound(`Comment`, commentId);

      if (files && files.length > 0) {
        const dir = path.join(
          __dirname,
          '..',
          '..',
          '..',
          Directory.UPLOAD,
          Directory.COMMENT_IMAGES,
        );

        await fs.mkdir(dir, { recursive: true });

        for (const file of files) {
          const fileName = generateUniqueSuffix(commentId, file.originalname);
          const filePath = path.join(dir, fileName);

          await fs.writeFile(filePath, file.buffer);

          await this.prismaService.imageLocation.create({
            data: {
              path: fileName,
              commentId,
            },
          });
        }
      }

      return {
        message: `Images uploaded to the comment with the id of ${commentId}`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
      throw error;
    }
  }

  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    accessToken: string,
  ) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, comment] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { id: userId },
        }),
        this.prismaService.comment.findFirst({
          where: { id: commentId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!comment) notFound(`Comment`, commentId);

      await this.prismaService.comment.update({
        where: { id: commentId },
        data: { ...updateCommentDto },
      });

      return {
        message: `Comment with the id ${commentId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async remove(commentId: number, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, comment] = await Promise.all([
        this.prismaService.user.findFirst({
          where: { id: userId },
        }),
        this.prismaService.comment.findFirst({
          where: { id: commentId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!comment) notFound(`Comment`, commentId);

      await this.prismaService.comment.delete({ where: { id: commentId } });

      return {
        message: `Comment with the id ${commentId} deleted successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
