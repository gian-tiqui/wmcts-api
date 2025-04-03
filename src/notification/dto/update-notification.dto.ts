import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @Transform(({ value }) => (value === 1 ? true : false))
  viewed: boolean;
}
