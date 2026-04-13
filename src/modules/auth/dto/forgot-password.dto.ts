import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico para recuperar contraseña',
    example: 'usuario@empresa.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;
}
