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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const supabase_service_1 = require("../../supabase/supabase.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    supabase;
    prisma;
    constructor(reflector, supabase, prisma) {
        this.reflector = reflector;
        this.supabase = supabase;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(roles_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('No se proporcionó token de autenticación');
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await this.supabase.getAdminClient().auth.getUser(token);
        if (error || !user) {
            throw new common_1.UnauthorizedException('Token inválido o expirado (' + (error?.message || '') + ')');
        }
        const dbUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, email: true, tenantId: true, role: true, isActive: true },
        });
        if (!dbUser || !dbUser.isActive) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo en base de datos');
        }
        request.user = {
            id: dbUser.id,
            email: dbUser.email,
            tenantId: dbUser.tenantId,
            role: dbUser.role,
        };
        return true;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        supabase_service_1.SupabaseService,
        prisma_service_1.PrismaService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map