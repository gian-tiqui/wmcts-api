import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
  Req,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Controller('categories')
export class CategoriesController {
  private logger: Logger = new Logger('CategoriesController');

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      return this.categoriesService.create(createCategoryDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':categoryId')
  findOne(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.findOne(categoryId);
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.categoriesService.update(categoryId, updateCategoryDto);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':categoryId')
  remove(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.categoriesService.remove(categoryId);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
