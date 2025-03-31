import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsInt()
  ticketId: number;
}
