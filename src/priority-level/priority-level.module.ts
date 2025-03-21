import { Module } from '@nestjs/common';
import { PriorityLevelService } from './priority-level.service';
import { PriorityLevelController } from './priority-level.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PriorityLevelController],
  providers: [PriorityLevelService, PrismaService],
})
export class PriorityLevelModule {}
