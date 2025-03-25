import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import errorHandler from 'src/utils/functions/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import extractUserId from 'src/utils/functions/extractUserId';
import notFound from 'src/utils/functions/notFound';
import { JwtService } from '@nestjs/jwt';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { Prisma } from '@prisma/client';
import { PaginationDefault } from 'src/utils/enums/enum';
import convertDatesToString from 'src/utils/functions/convertDatesToString';

@Injectable()
export class TicketService {
  logger: Logger = new Logger('TicketService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createTicketDto: CreateTicketDto, accessToken: string) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!user) notFound('User', userId);

      const newTicket = await this.prismaService.ticket.create({
        data: {
          ...createTicketDto,
          issuerId: user.id,
          statusId: 1,
        },
      });

      await this.prismaService.activity.create({
        data: {
          activity: `This Ticket is created by ${user.firstName} ${user.lastName}`,
          title: `Ticket Created`,
          ticketId: newTicket.id,
          icon: '',
        },
      });

      return {
        message: 'Ticket created successfully.',
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findAll(query: FindAllDto) {
    try {
      const { search, offset, limit, statusId, sortBy, sortOrder } = query;
      const where: Prisma.TicketWhereInput = {
        ...(search && {
          OR: [
            {
              title: { contains: search, mode: 'insensitive' },
            },
            {
              title: { contains: search, mode: 'insensitive' },
            },
          ],
        }),
        statusId,
      };
      const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

      const tickets = await this.prismaService.ticket.findMany({
        where,
        orderBy,
        skip: offset || PaginationDefault.OFFSET,
        take: limit || PaginationDefault.LIMIT,
        include: {
          category: true,
          issuer: { include: { department: true } },
          assignedUser: true,
          priorityLevel: true,
        },
      });
      const count = await this.prismaService.ticket.count({ where });

      convertDatesToString(tickets);

      return {
        message: `Tickets loaded successfully.`,
        tickets,
        count,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findOne(id: number) {
    try {
      const ticket = await this.prismaService.ticket.findFirst({
        where: { id },
        include: {
          serviceReports: true,
          comments: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          activities: true,
          assignedUser: {
            select: { firstName: true, lastName: true, department: true },
          },
          issuer: {
            select: { firstName: true, lastName: true, department: true },
          },
          category: true,
          department: true,
          priorityLevel: true,
          status: true,
        },
      });

      if (!ticket) notFound('Ticket', id);

      convertDatesToString([ticket]);
      convertDatesToString([...ticket.comments.map((comment) => comment)]);
      convertDatesToString([...ticket.activities]);

      return {
        message: `Ticket with the id ${id} loaded successfully.`,
        ticket,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findTicketCommentsById(ticketId: number) {
    try {
      const ticket = await this.prismaService.ticket.findFirst({
        where: { id: ticketId },
        include: { comments: true },
      });

      if (!ticket) notFound(`Ticket`, ticketId);

      const { comments } = ticket;

      return {
        message: `Comments of the ticket with the id ${ticketId} loaded successfully`,
        comments,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
