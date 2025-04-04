import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
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
  @RateLimit({
    keyPrefix: 'create-priority-level',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before creating priority level.',
  })
  create(@Body() createPriorityLevelDto: CreatePriorityLevelDto) {
    return this.priorityLevelService.create(createPriorityLevelDto);
  }

  @Get()
  @RateLimit({
    keyPrefix: 'find-priority-levels',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before finding priority levels.',
  })
  findAll(@Query() query: FindAllDto) {
    return this.priorityLevelService.findAll(query);
  }

  @Get(':priorityLevelId')
  @RateLimit({
    keyPrefix: 'find-priority-level',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before finding a priority level.',
  })
  findOne(@Param('priorityLevelId', ParseIntPipe) priorityLevelId: number) {
    return this.priorityLevelService.findOne(priorityLevelId);
  }

  @Patch(':priorityLevelId')
  update(
    @Param('priorityLevelId', ParseIntPipe) priorityLevelId: number,
    @Body() updatePriorityLevelDto: UpdatePriorityLevelDto,
  ) {
    return this.priorityLevelService.update(
      priorityLevelId,
      updatePriorityLevelDto,
    );
  }

  @Delete(':priorityLevelId')
  remove(@Param('priorityLevelId', ParseIntPipe) priorityLevelId: number) {
    return this.priorityLevelService.remove(priorityLevelId);
  }
}
