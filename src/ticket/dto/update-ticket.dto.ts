import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsInt()
  deptId: number;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsInt()
  priorityLevelId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  assignedUserId?: number;

  @IsOptional()
  @IsInt()
  statusId?: number;

  @IsOptional()
  @IsDate()
  acknowledgedAt: Date;
}
