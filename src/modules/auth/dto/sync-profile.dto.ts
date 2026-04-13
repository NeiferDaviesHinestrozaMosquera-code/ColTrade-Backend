import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncProfileDto {
  @ApiProperty({ description: 'Slug único de la empresa (e.g. "empresa-abc")' })
  @IsString()
  tenantSlug: string;

  @ApiPropertyOptional({ description: 'Nombre comercial de la empresa' })
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiPropertyOptional({ description: 'NIT de la empresa' })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del usuario' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'URL del avatar del usuario' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
