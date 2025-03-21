import { Injectable, Logger } from '@nestjs/common';
import { CreatePriorityLevelDto } from './dto/create-priority-level.dto';
import { UpdatePriorityLevelDto } from './dto/update-priority-level.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';

@Injectable()
export class PriorityLevelService {
  private logger: Logger = new Logger('PriorityLevelController');

  constructor(private readonly prismaService: PrismaService) {}

  create(createPriorityLevelDto: CreatePriorityLevelDto) {
    return 'This action adds a new priorityLevel';
  }

  async findAll(query: FindAllDto) {
    try {
      const { search, offset, limit, sortBy, sortOrder } = query;
      const where: Prisma.PriorityLevelWhereInput = {
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      };
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const priorityLevels = await this.prismaService.priorityLevel.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.priorityLevel.count({ where });

      return {
        message: `Priority levels loaded successfully`,
        priorityLevels,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} priorityLevel`;
  }

  update(id: number, updatePriorityLevelDto: UpdatePriorityLevelDto) {
    return `This action updates a #${id} priorityLevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} priorityLevel`;
  }
}
