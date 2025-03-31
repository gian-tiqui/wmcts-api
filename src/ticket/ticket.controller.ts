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
  UploadedFiles,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateLimit } from 'nestjs-rate-limiter';
import { Messages } from 'src/utils/enums/enum';

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

  @Post(':ticketId/serviceReport')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(Messages.IMAGES_ERROR), false);
        }
      },
    }),
  )
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before uploading images for the service report.',
    keyPrefix: 'upload-service-report',
    points: 10,
  })
  uploadTicketServiceReportById(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.ticketService.uploadServiceReports(
        ticketId,
        accessToken,
        files,
      );
    } catch (error) {
      errorHandler(error, this.ticketLogger);
    }
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
