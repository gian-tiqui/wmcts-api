import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PriorityLevelService } from './priority-level.service';
import { CreatePriorityLevelDto } from './dto/create-priority-level.dto';
import { UpdatePriorityLevelDto } from './dto/update-priority-level.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('priority-level')
export class PriorityLevelController {
  constructor(private readonly priorityLevelService: PriorityLevelService) {}

  @Post()
  create(@Body() createPriorityLevelDto: CreatePriorityLevelDto) {
    return this.priorityLevelService.create(createPriorityLevelDto);
  }

  @RateLimit({
    keyPrefix: 'find-priority-levels',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before finding priority levels.',
  })
  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.priorityLevelService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priorityLevelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriorityLevelDto: UpdatePriorityLevelDto,
  ) {
    return this.priorityLevelService.update(+id, updatePriorityLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priorityLevelService.remove(+id);
  }
}
