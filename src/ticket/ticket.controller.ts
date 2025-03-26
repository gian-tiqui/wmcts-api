import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Controller('ticket')
export class TicketController {
  private ticketLogger = new Logger('TicketController');

  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      return this.ticketService.create(createTicketDto, accessToken);
    } catch (error) {
      errorHandler(error, this.ticketLogger);
    }
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.ticketService.findAll(query);
  }

  @Get(':ticketId')
  findOne(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.ticketService.findOne(+ticketId);
  }

  @Patch(':ticketId')
  update(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.ticketService.update(ticketId, updateTicketDto, accessToken);
    } catch (error) {
      errorHandler(error, this.ticketLogger);
    }
  }

  @Delete(':ticketId')
  remove(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.ticketService.remove(+ticketId);
  }
}
