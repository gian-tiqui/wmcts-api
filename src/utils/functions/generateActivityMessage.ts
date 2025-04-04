import { Ticket, User } from '@prisma/client';
import { StatusIcons, TicketStatus } from '../enums/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import notFound from './notFound';
import { UpdateTicketDto } from 'src/ticket/dto/update-ticket.dto';
import { MailerService } from '@nestjs-modules/mailer';

const generateActivityMessage = async (
  statusId: number,
  user: User,
  prismaService: PrismaService,
  ticket: Ticket,
  updateTicketDto: UpdateTicketDto,
  mailerService: MailerService,
) => {
  let activity: string;
  let title: string;
  let assignedUser: User;
  let message: string;

  await mailerService.sendMail({
    to: user.email,
    subject: 'WMC Intranet Activation',
    template: 'activity',
    context: {
      name: user.firstName,
      id: ticket.id,
    },
  });

  if (updateTicketDto.priorityLevelId) {
    const severity = await prismaService.priorityLevel.findFirst({
      where: { id: updateTicketDto.priorityLevelId },
    });
    const prevSeverity = await prismaService.priorityLevel.findFirst({
      where: { id: ticket.priorityLevelId },
    });
    title = `Ticket Severity changed`;
    activity = `The ticket's severity was changed from ${prevSeverity.name} to ${severity.name} by ${user.firstName} ${user.lastName}`;

    await prismaService.activity.create({
      data: {
        title,
        ticketId: ticket.id,
        activity,
        icon: 'pi pi-info',
      },
    });
  }

  if (updateTicketDto.title && ticket.title != updateTicketDto.title) {
    title = `Ticket Title Changed`;
    activity = `The ticket's title was changed from "${ticket.title}" to "${updateTicketDto.title}" by ${user.firstName} ${user.lastName}`;

    await prismaService.activity.create({
      data: {
        title,
        ticketId: ticket.id,
        activity,
        icon: 'pi pi-pencil',
      },
    });
  }

  if (
    updateTicketDto.description &&
    ticket.description != updateTicketDto.description
  ) {
    title = `Ticket Description Changed`;
    activity = `The ticket's description was changed from "${ticket.description}" to "${updateTicketDto.description}"`;

    await prismaService.activity.create({
      data: {
        title,
        ticketId: ticket.id,
        activity,
        icon: 'pi pi-pencil',
      },
    });
  }

  if (updateTicketDto.statusId) {
    switch (statusId) {
      case TicketStatus.NEW:
        activity = `This Ticket was re-opened by ${user.firstName} ${user.lastName}`;
        title = 'Ticket Re-opened';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.NEW,
          },
        });

        break;
      case TicketStatus.ACKNOWLEDGED:
        activity = `This Ticket was acknowledged by ${user.firstName} ${user.lastName}`;
        title = 'Ticket Acknowledged';

        await prismaService.ticket.update({
          where: { id: ticket.id },
          data: {
            acknowledgedAt: new Date(),
          },
        });

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.ACKNOWLEDGED,
          },
        });

        message = `Your ticket "${ticket.title}" was acknowledged by ${user.firstName} ${user.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.ASSIGNED:
        assignedUser = await prismaService.user.findFirst({
          where: { id: updateTicketDto.assignedUserId },
        });

        if (!assignedUser) notFound(`User`, ticket.assignedUserId);

        activity = `This Ticket was assigned to ${assignedUser.firstName} ${assignedUser.lastName} by ${user.firstName} ${user.lastName}`;

        title = 'Ticket Assigned';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.ESCALATED,
          },
        });

        message = `Your Ticket '${ticket.title}' was assigned to ${assignedUser.firstName} ${assignedUser.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.ESCALATED:
        assignedUser = await prismaService.user.findFirst({
          where: { id: updateTicketDto.assignedUserId },
        });

        if (!assignedUser) notFound(`User`, updateTicketDto.assignedUserId);

        activity = `This Ticket was escalated to ${assignedUser.firstName} ${assignedUser.lastName} by ${user.firstName} ${user.lastName}`;

        title = 'Ticket Escalated';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.ESCALATED,
          },
        });

        message = `Your Ticket '${ticket.title}' was escalated to ${assignedUser.firstName} ${assignedUser.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.CANCELLED:
        activity = `This Ticket was cancelled by ${user.firstName} ${user.lastName}`;
        title = 'Ticket Cancelled';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.CANCELLED,
          },
        });

        break;
      case TicketStatus.CLOSED:
        activity = `This Ticket was closed by ${user.firstName} ${user.lastName}`;
        title = 'Ticket Closed';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.CLOSED,
          },
        });

        message = `Your Ticket '${ticket.title}' was closed by ${user.firstName} ${user.lastName}`;
        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.CLOSED_RESOLVED:
        activity = `This Resolved Ticket was closed by ${user.firstName} ${user.lastName}`;
        title = 'Ticket Closed-Resolved';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.CLOSED_RESOLVED,
          },
        });

        message = `Your Ticket '${ticket.title}' was closed resolved by ${user.firstName} ${user.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.ON_HOLD:
        activity = `This Ticket is on-hold for now`;
        title = 'Ticket On-Hold';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.ON_HOLD,
          },
        });

        message = `Your Ticket '${ticket.title}' was put on-hold by ${user.firstName} ${user.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.RESOLVED:
        assignedUser = await prismaService.user.findFirst({
          where: { id: ticket.assignedUserId },
        });

        activity = `This Ticket is resolved by ${assignedUser.firstName} ${assignedUser.lastName}`;
        title = 'Ticket Resolved';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.RESOLVED,
          },
        });

        message = `Your Ticket '${ticket.title}' was resolved by ${user.firstName} ${user.lastName}`;

        await prismaService.notification.create({
          data: {
            message,
            title,
            userId: ticket.issuerId,
            ticketId: ticket.id,
          },
        });

        break;
      case TicketStatus.ON_HOLD:
        break;
      default:
        activity = `This Ticket is a ticket`;
        title = 'Ticket';

        await prismaService.activity.create({
          data: {
            title,
            ticketId: ticket.id,
            activity,
            icon: StatusIcons.ON_HOLD,
          },
        });

        break;
    }
  }
};

export default generateActivityMessage;
