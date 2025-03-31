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
import generateActivityMessage from 'src/utils/functions/generateActivityMessage';
import convertAcknowledgeAt from 'src/utils/functions/convertAcknowledgeAt';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Directory } from 'src/utils/enums/enum';
import generateUniqueSuffix from 'src/utils/functions/generateUniqueSuffix';

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
          icon: 'pi pi-ticket',
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
      const { search, offset, limit, statusId, sortBy, sortOrder, deptId } =
        query;
      const where: Prisma.TicketWhereInput = {
        ...(search && {
          OR: [
            {
              title: { contains: search, mode: 'insensitive' },
            },
            {
              description: { contains: search, mode: 'insensitive' },
            },
          ],
        }),
        statusId,
        ...(deptId && { deptId }),
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

  async findOne(ticketId: number) {
    try {
      const ticket = await this.prismaService.ticket.findFirst({
        where: { id: ticketId },
        include: {
          serviceReports: { include: { imageLocations: true } },
          comments: {
            include: {
              user: { select: { firstName: true, lastName: true } },
              imageLocations: true,
            },
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

      if (!ticket) notFound('Ticket', ticketId);

      convertDatesToString([ticket]);
      convertDatesToString([...ticket.comments.map((comment) => comment)]);
      convertDatesToString([...ticket.activities]);

      if (ticket.acknowledgedAt) convertAcknowledgeAt(ticket);

      return {
        message: `Ticket with the id ${ticketId} loaded successfully.`,
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

  async uploadServiceReports(
    ticketId: number,
    accessToken: string,
    files: Express.Multer.File[],
  ) {
    try {
      const serviceReporterId = extractUserId(accessToken, this.jwtService);

      const user = await this.prismaService.user.findFirst({
        where: { id: serviceReporterId },
      });

      if (!user) notFound(`User`, serviceReporterId);

      const { id } = await this.prismaService.serviceReport.create({
        data: {
          ticketId,
          serviceReporterId,
        },
      });

      if (files && files.length > 0) {
        const dir = path.join(
          __dirname,
          '..',
          '..',
          '..',
          Directory.UPLOAD,
          Directory.SERVICE_REPORT,
        );

        await fs.mkdir(dir, { recursive: true });

        for (const file of files) {
          const fileName = generateUniqueSuffix(ticketId, file.originalname);
          const filePath = path.join(dir, fileName);

          await fs.writeFile(filePath, file.buffer);

          await this.prismaService.imageLocation.create({
            data: {
              path: fileName,
              serviceReportId: id,
            },
          });
        }
      }
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async update(
    ticketId: number,
    updateTicketDto: UpdateTicketDto,
    accessToken: string,
  ) {
    try {
      const userId = extractUserId(accessToken, this.jwtService);
      const [user, ticket] = await Promise.all([
        this.prismaService.user.findFirst({ where: { id: userId } }),
        this.prismaService.ticket.findFirst({
          where: { id: ticketId },
        }),
      ]);

      if (!ticket) notFound(`Ticket`, ticketId);
      if (!user) notFound(`User`, userId);

      generateActivityMessage(
        updateTicketDto.statusId,
        user,
        this.prismaService,
        ticket,
        updateTicketDto,
      );

      await this.prismaService.ticket.update({
        where: { id: ticketId },
        data: updateTicketDto,
      });

      return {
        message: `Ticket with the id ${ticketId} updated successfully.`,
      };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  remove(ticketId: number) {
    return `This action removes a #${ticketId} ticket`;
  }
}
