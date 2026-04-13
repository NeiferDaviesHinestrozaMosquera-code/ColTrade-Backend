"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const supabase_service_1 = require("../../supabase/supabase.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    supabase;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async register(dto) {
        this.logger.log(`[register] Paso 1: Verificando email ${dto.email}...`);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Ya existe una cuenta con este correo');
        }
        this.logger.log(`[register] Paso 2: Creando usuario en Supabase Auth...`);
        const { data: authData, error: authError } = await this.supabase.getAdminClient().auth.admin.createUser({
            email: dto.email,
            password: dto.password,
            email_confirm: true,
            user_metadata: {
                full_name: dto.fullName,
                tenant_slug: dto.tenantSlug,
            },
        });
        if (authError) {
            this.logger.error(`[register] Error en Supabase Auth: ${authError.message}`);
            if (authError.message.includes('already been registered')) {
                throw new common_1.ConflictException('Ya existe una cuenta con este correo');
            }
            throw new common_1.InternalServerErrorException('Error al crear la cuenta. Intenta de nuevo.');
        }
        const supabaseUserId = authData.user.id;
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
        const user = await this.prisma.user.create({
            data: {
                id: supabaseUserId,
                email: dto.email,
                fullName: dto.fullName,
                tenantId: tenant.id,
                role: 'ADMIN',
            },
            include: {
                tenant: {
                    select: { id: true, name: true, slug: true, planTier: true },
                },
            },
        });
        const { data: sessionData, error: sessionError } = await this.supabase.getAdminClient().auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });
        if (sessionError) {
            this.logger.error(`Error generando sesión: ${sessionError.message}`);
            throw new common_1.InternalServerErrorException('Cuenta creada exitosamente, pero hubo un error generando la sesión. Intenta hacer login.');
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
    async login(dto) {
        const { data, error } = await this.supabase.getAdminClient().auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });
        if (error) {
            this.logger.warn(`Login fallido para ${dto.email}: ${error.message}`);
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: data.user.id },
            include: {
                tenant: {
                    select: { id: true, name: true, slug: true, planTier: true },
                },
            },
        });
        if (!user) {
            this.logger.warn(`Usuario ${data.user.id} existe en Supabase Auth pero no en DB`);
            throw new common_1.NotFoundException('Tu cuenta no está configurada correctamente. Contacta soporte.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tu cuenta ha sido desactivada. Contacta soporte.');
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
    async refreshToken(dto) {
        const { data, error } = await this.supabase.getAdminClient().auth.refreshSession({
            refresh_token: dto.refreshToken,
        });
        if (error || !data.session) {
            this.logger.warn(`Refresh token inválido: ${error?.message}`);
            throw new common_1.UnauthorizedException('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in,
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return {
                message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
            };
        }
        const { error } = await this.supabase.getAdminClient().auth.resetPasswordForEmail(dto.email, {
            redirectTo: `${process.env.FRONTEND_URL ?? 'http://localhost:3001'}/reset-password`,
        });
        if (error) {
            this.logger.error(`Error enviando email de reset: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error al enviar el correo de recuperación.');
        }
        return {
            message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
        };
    }
    async logout(userId) {
        const { error } = await this.supabase.getAdminClient().auth.admin.signOut(userId);
        if (error) {
            this.logger.error(`Error cerrando sesión: ${error.message}`);
        }
        this.logger.log(`Logout exitoso: ${userId}`);
        return { message: 'Sesión cerrada exitosamente' };
    }
    async syncProfile(userId, email, dto) {
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
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenant: {
                    select: { id: true, name: true, slug: true, planTier: true },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map