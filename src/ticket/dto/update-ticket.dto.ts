import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsInt()
  deptId: number;

  @IsOptional()
  @IsInt()
  categoryId: number;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  closingReason: string;

  @IsOptional()
  @IsDate()
  resolvedAt: Date;

  @IsOptional()
  @IsString()
  resolution: string;
}
