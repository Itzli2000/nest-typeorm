import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Limit of products per page',
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'limit must be greater than 0' })
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'Offset of products per page',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'offset must be greater than or equal to 0' })
  @Type(() => Number)
  offset?: number;

  @ApiProperty({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'page must be greater than 0' })
  @Type(() => Number)
  page?: number;
}
