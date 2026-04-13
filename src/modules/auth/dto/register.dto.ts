import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@empresa.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 8 caracteres)',
    example: 'MiPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Slug único de la empresa (sin espacios, lowercase)',
    example: 'mi-empresa',
  })
  @IsString()
  tenantSlug: string;

  @ApiPropertyOptional({
    description: 'Nombre comercial de la empresa',
    example: 'Mi Empresa S.A.S.',
  })
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiPropertyOptional({
    description: 'NIT de la empresa',
    example: '900123456-1',
  })
  @IsOptional()
  @IsString()
  nit?: string;
}
