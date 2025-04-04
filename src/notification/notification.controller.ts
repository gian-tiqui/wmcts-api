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
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RateLimit } from 'nestjs-rate-limiter';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  private logger: Logger = new Logger('NotificationController');

  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before creating a notification.',
    keyPrefix: 'create-notification',
    points: 10,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading all notifications.',
    keyPrefix: 'get-notification',
    points: 10,
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':notificationId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading a notification.',
    keyPrefix: 'get-notification-by-id',
    points: 10,
  })
  findOne(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.findOne(notificationId);
  }

  @Patch(':notificationId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a notification.',
    keyPrefix: 'update-notification',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before deleting a notification.',
    keyPrefix: 'delete-notification',
    points: 10,
  })
  remove(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.remove(notificationId);
  }
}
