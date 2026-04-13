import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SyncProfileDto } from './dto/sync-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // REGISTER
  // ──────────────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    this.logger.log(`[register] Paso 1: Verificando email ${dto.email}...`);
    // 1. Verificar que el email no exista en nuestra DB
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    this.logger.log(`[register] Paso 2: Creando usuario en Supabase Auth...`);
    // 2. Crear usuario en Supabase Auth (admin API — no requiere confirmación)
    const { data: authData, error: authError } =
      await this.supabase.getAdminClient().auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true, // Confirma el email automáticamente
        user_metadata: {
          full_name: dto.fullName,
          tenant_slug: dto.tenantSlug,
        },
      });

    if (authError) {
      this.logger.error(`[register] Error en Supabase Auth: ${authError.message}`);

      if (authError.message.includes('already been registered')) {
        throw new ConflictException('Ya existe una cuenta con este correo');
      }
      throw new InternalServerErrorException(
        'Error al crear la cuenta. Intenta de nuevo.',
      );
    }

    const supabaseUserId = authData.user.id;

    // 3. Buscar o crear el Tenant en nuestra DB
    let tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          name: dto.tenantName ?? dto.tenantSlug,
          slug: dto.tenantSlug,
          nit: dto.nit,
        },
      });
      this.logger.log(`Nuevo tenant creado: ${tenant.slug}`);
    }

    // 4. Crear el usuario en nuestra DB (vinculado al Supabase UID)
    const user = await this.prisma.user.create({
      data: {
        id: supabaseUserId,
        email: dto.email,
        fullName: dto.fullName,
        tenantId: tenant.id,
        role: 'ADMIN', // Primer usuario de un tenant es ADMIN
      },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true, planTier: true },
        },
      },
    });

    // 5. Hacer login inmediato para obtener tokens
    const { data: sessionData, error: sessionError } =
      await this.supabase.getAdminClient().auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (sessionError) {
      this.logger.error(`Error generando sesión: ${sessionError.message}`);
      // El usuario fue creado pero hubo un error con la sesión,
      // el usuario puede hacer login manualmente
      throw new InternalServerErrorException(
        'Cuenta creada exitosamente, pero hubo un error generando la sesión. Intenta hacer login.',
      );
    }

    this.logger.log(`Usuario registrado: ${user.email} (${user.id})`);

    return {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresIn: sessionData.session.expires_in,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenant: user.tenant,
      },
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ──────────────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    // 1. Autenticar con Supabase Auth
    const { data, error } =
      await this.supabase.getAdminClient().auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error) {
      this.logger.warn(`Login fallido para ${dto.email}: ${error.message}`);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Obtener datos completos del usuario en nuestra DB
    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true, planTier: true },
        },
      },
    });

    if (!user) {
      // El usuario existe en Supabase Auth pero no en nuestra DB
      // Esto puede ocurrir si se creó directamente en el dashboard de Supabase
      this.logger.warn(
        `Usuario ${data.user.id} existe en Supabase Auth pero no en DB`,
      );
      throw new NotFoundException(
        'Tu cuenta no está configurada correctamente. Contacta soporte.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Tu cuenta ha sido desactivada. Contacta soporte.',
      );
    }

    this.logger.log(`Login exitoso: ${user.email}`);

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenant: user.tenant,
      },
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // REFRESH TOKEN
  // ──────────────────────────────────────────────────────────────────────────

  async refreshToken(dto: RefreshTokenDto) {
    const { data, error } =
      await this.supabase.getAdminClient().auth.refreshSession({
        refresh_token: dto.refreshToken,
      });

    if (error || !data.session) {
      this.logger.warn(`Refresh token inválido: ${error?.message}`);
      throw new UnauthorizedException(
        'Sesión expirada. Por favor inicia sesión nuevamente.',
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ──────────────────────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    // Verificar que el usuario exista en nuestra DB
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // No revelamos si el email existe o no (seguridad)
      return {
        message:
          'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
      };
    }

    const { error } =
      await this.supabase.getAdminClient().auth.resetPasswordForEmail(dto.email, {
        redirectTo: `${process.env.FRONTEND_URL ?? 'http://localhost:3001'}/reset-password`,
      });

    if (error) {
      this.logger.error(`Error enviando email de reset: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al enviar el correo de recuperación.',
      );
    }

    return {
      message:
        'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────────────────────────────────────

  async logout(userId: string) {
    // Invalidar todas las sesiones del usuario en Supabase
    const { error } = await this.supabase.getAdminClient().auth.admin.signOut(userId);

    if (error) {
      this.logger.error(`Error cerrando sesión: ${error.message}`);
      // No lanzamos error — el logout debería siempre "funcionar" desde la perspectiva del cliente
    }

    this.logger.log(`Logout exitoso: ${userId}`);

    return { message: 'Sesión cerrada exitosamente' };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SYNC PROFILE (ya existente — mejorado)
  // ──────────────────────────────────────────────────────────────────────────

  async syncProfile(userId: string, email: string, dto: SyncProfileDto) {
    let tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          name: dto.tenantName ?? dto.tenantSlug,
          slug: dto.tenantSlug,
          nit: dto.nit,
        },
      });
      this.logger.log(`Nuevo tenant creado: ${tenant.slug}`);
    }

    const user = await this.prisma.user.upsert({
      where: { id: userId },
      update: {
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
      },
      create: {
        id: userId,
        email,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
        tenantId: tenant.id,
        role: 'ADMIN',
      },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true, planTier: true },
        },
      },
    });

    return { user, tenant };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET ME (ya existente)
  // ──────────────────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true, planTier: true },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
