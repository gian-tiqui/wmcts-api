import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RateLimit } from 'nestjs-rate-limiter';

@UseGuards(JwtAuthGuard)
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before creating a new status.',
    keyPrefix: 'create-user',
    points: 10,
  })
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading statuses.',
    keyPrefix: 'create-status',
    points: 10,
  })
  findAll(@Query() query: FindAllDto) {
    return this.statusService.findAll(query);
  }

  @Get(':statusId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before finding a status.',
    keyPrefix: 'get-status',
    points: 10,
  })
  findOne(@Param('statusId', ParseIntPipe) statusId: number) {
    return this.statusService.findOne(statusId);
  }

  @Patch(':statusId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a status.',
    keyPrefix: 'update-status',
    points: 10,
  })
  update(
    @Param('statusId', ParseIntPipe) statusId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.update(statusId, updateStatusDto);
  }

  @Delete(':statusId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before removing a status.',
    keyPrefix: 'remove-status',
    points: 10,
  })
  remove(@Param('statusId', ParseIntPipe) statusId: number) {
    return this.statusService.remove(statusId);
  }
}
