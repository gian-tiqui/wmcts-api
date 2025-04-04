import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import errorHandler from 'src/utils/functions/errorHandler';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Injectable()
export class CategoriesService {
  private logger: Logger = new Logger('CategoriesService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!user) notFound(`User`, userId);

      await this.prismaService.category.create({ data: createCategoryDto });

      return {
        message: `Category created successfully by ${user.firstName} ${user.lastName} (${user.id})`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findAll(query: FindAllDto) {
    try {
      const { search, offset, limit } = query;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
