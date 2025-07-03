import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'limit must be greater than 0' })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'offset must be greater than or equal to 0' })
  @Type(() => Number)
  offset?: number;
}
