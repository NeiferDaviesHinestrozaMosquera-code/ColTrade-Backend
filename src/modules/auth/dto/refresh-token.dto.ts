import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token para renovar la sesión',
  })
  @IsString()
  refreshToken: string;
}
