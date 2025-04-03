import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import extractUserId from 'src/utils/functions/extractUserId';
import { JwtService } from '@nestjs/jwt';
import notFound from 'src/utils/functions/notFound';

@Injectable()
export class NotificationService {
  private logger: Logger = new Logger('NotificationService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async update(
    notificationId: number,
    updateNotificationDto: UpdateNotificationDto,
    accessToken: string,
  ) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const [user, notification] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.notification.findFirst({
          where: { id: notificationId },
        }),
      ]);

      if (!user) notFound(`User`, userId);
      if (!notification) notFound(`Notification`, notificationId);

      await this.prismaService.notification.update({
        where: { id: notificationId },
        data: updateNotificationDto,
      });

      return {
        message: `Notification with the id ${notificationId} updated successfully`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
