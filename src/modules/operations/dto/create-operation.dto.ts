import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperationType } from '@prisma/client';

export class CreateOperationDto {
  @ApiProperty({ enum: OperationType })
  @IsEnum(OperationType)
  type: OperationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  blNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nandinaCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originCountry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destCountry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  valueUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customsPort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  eta?: string;
}
