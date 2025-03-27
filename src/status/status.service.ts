import { Injectable, Logger } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class StatusService {
  private logger: Logger = new Logger('StatusService');

  constructor(private readonly prismaService: PrismaService) {}

  create(createStatusDto: CreateStatusDto) {
    return 'This action adds a new status';
  }

  async findAll(query: FindAllDto) {
    try {
      const { offset, limit, search } = query;
      const where: Prisma.StatusWhereInput = {
        ...(search && {
          OR: [{ type: { contains: search, mode: 'insensitive' } }],
        }),
      };

      const statuses = await this.prismaService.status.findMany({
        where,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.status.count({ where });

      return {
        message: 'Statuses loaded successfully',
        statuses,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findOne(statusId: number) {
    return `This action returns a #${statusId} status`;
  }

  update(statusId: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${statusId} status`;
  }

  remove(statusId: number) {
    return `This action removes a #${statusId} status`;
  }
}
