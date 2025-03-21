import { PartialType } from '@nestjs/swagger';
import { CreatePriorityLevelDto } from './create-priority-level.dto';

export class UpdatePriorityLevelDto extends PartialType(
  CreatePriorityLevelDto,
) {}
