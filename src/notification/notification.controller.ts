import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Logger,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';

@Controller('notification')
export class NotificationController {
  private logger: Logger = new Logger('NotificationController');

  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':notificationId')
  findOne(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.findOne(notificationId);
  }

  @Patch(':notificationId')
  update(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.notificationService.update(
        notificationId,
        updateNotificationDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':notificationId')
  remove(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.remove(notificationId);
  }
}
