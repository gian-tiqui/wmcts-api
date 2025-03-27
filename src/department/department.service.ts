import { Injectable, Logger } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import errorHandler from 'src/utils/functions/errorHandler';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';
import notFound from 'src/utils/functions/notFound';
import insertfullName from 'src/utils/functions/insertFullName';

@Injectable()
export class DepartmentService {
  private logger: Logger = new Logger('DepartmentService');

  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  createDepartment(createDepartmentDto: CreateDepartmentDto) {
    return 'This action adds a new department';
  }

  async findDepartments(query: FindAllDto) {
    try {
      const { search, offset, limit, sortBy, sortOrder } = query;
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const where: Prisma.DepartmentWhereInput = {
        ...(search && {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };
      const departments = await this.prismaService.department.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.department.count({
        where,
      });

      return {
        message: 'Departments loaded successfully.',
        departments,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  findDepartmentById(id: number) {
    return `This action returns a #${id} department`;
  }

  async findDepartmentCategoriesById(deptId: number, query: FindAllDto) {
    try {
      const { search, offset, limit, sortBy, sortOrder } = query;
      const where: Prisma.CategoryWhereInput = {
        ...(search && {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }),
        deptId,
      };
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const categories = await this.prismaService.category.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.category.count({ where });

      return {
        message: `Categories of the department ${deptId} loaded successfully.`,
        categories,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findDepartmentUsersByDepartmentId(deptId: number, query: FindAllDto) {
    try {
      const department = await this.prismaService.department.findFirst({
        where: { id: deptId },
      });

      if (!department) notFound(`Department`, deptId);

      const { search, offset, limit } = query;

      const where: Prisma.UserWhereInput = {
        deptId,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { middleName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const users = await this.prismaService.user.findMany({
        where,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
      });

      const count = await this.prismaService.user.count({ where });

      return {
        message: `Users of the department with the id ${deptId} loaded successfully.`,
        users: insertfullName(users),
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  updateDepartmentById(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  removeDepartmentById(id: number) {
    return `This action removes a #${id} department`;
  }
}
