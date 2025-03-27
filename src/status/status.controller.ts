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
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.statusService.findAll(query);
  }

  @Get(':statusId')
  findOne(@Param('statusId', ParseIntPipe) statusId: number) {
    return this.statusService.findOne(statusId);
  }

  @Patch(':statusId')
  update(
    @Param('statusId', ParseIntPipe) statusId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.update(statusId, updateStatusDto);
  }

  @Delete(':statusId')
  remove(@Param('statusId', ParseIntPipe) statusId: number) {
    return this.statusService.remove(statusId);
  }
}
