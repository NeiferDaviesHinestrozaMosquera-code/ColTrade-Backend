import { PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OperationStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {
  @ApiPropertyOptional({ enum: OperationStatus })
  @IsOptional()
  @IsEnum(OperationStatus)
  status?: OperationStatus;
}
