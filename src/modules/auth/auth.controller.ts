import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SyncProfileDto } from './dto/sync-profile.dto';
import { Public } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Endpoints Públicos ──────────────────────────────────────────────────

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario y empresa',
    description:
      'Crea una cuenta en Supabase Auth, un Tenant y un User en la base de datos. Retorna tokens JWT.',
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica al usuario contra Supabase Auth y retorna tokens JWT junto con los datos del perfil.',
  })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar tokens',
    description:
      'Usa un refresh token válido para obtener nuevos access y refresh tokens.',
  })
  @ApiResponse({ status: 200, description: 'Tokens renovados exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description:
      'Envía un email con un enlace para restablecer la contraseña.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado (si la cuenta existe)',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // ── Endpoints Protegidos ────────────────────────────────────────────────

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Invalida todas las sesiones del usuario en Supabase Auth.',
  })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Retorna los datos del usuario y su tenant.',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id);
  }

  @Post('sync-profile')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sincronizar perfil de Supabase Auth a DB',
    description:
      'Crea o actualiza el perfil del usuario en la base de datos local.',
  })
  syncProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SyncProfileDto,
  ) {
    return this.authService.syncProfile(user.id, user.email, dto);
  }

  // ── Health Check ────────────────────────────────────────────────────────

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check (público)' })
  health() {
    return { status: 'ok', service: 'coltrade-auth', version: '1.0.0' };
  }
}
