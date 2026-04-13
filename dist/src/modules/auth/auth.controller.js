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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const sync_profile_dto_1 = require("./dto/sync-profile.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    refreshToken(dto) {
        return this.authService.refreshToken(dto);
    }
    forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    logout(user) {
        return this.authService.logout(user.id);
    }
    getMe(user) {
        return this.authService.getMe(user.id);
    }
    syncProfile(user, dto) {
        return this.authService.syncProfile(user.id, user.email, dto);
    }
    health() {
        return { status: 'ok', service: 'coltrade-auth', version: '1.0.0' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, roles_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Registrar nuevo usuario y empresa',
        description: 'Crea una cuenta en Supabase Auth, un Tenant y un User en la base de datos. Retorna tokens JWT.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El email ya está registrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, roles_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Iniciar sesión',
        description: 'Autentica al usuario contra Supabase Auth y retorna tokens JWT junto con los datos del perfil.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login exitoso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales incorrectas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, roles_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Renovar tokens',
        description: 'Usa un refresh token válido para obtener nuevos access y refresh tokens.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens renovados exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Refresh token inválido o expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, roles_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Solicitar recuperación de contraseña',
        description: 'Envía un email con un enlace para restablecer la contraseña.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email enviado (si la cuenta existe)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Cerrar sesión',
        description: 'Invalida todas las sesiones del usuario en Supabase Auth.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión cerrada exitosamente' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_strategy_1.AuthenticatedUser]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener perfil del usuario autenticado',
        description: 'Retorna los datos del usuario y su tenant.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil del usuario' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_strategy_1.AuthenticatedUser]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('sync-profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Sincronizar perfil de Supabase Auth a DB',
        description: 'Crea o actualiza el perfil del usuario en la base de datos local.',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_strategy_1.AuthenticatedUser,
        sync_profile_dto_1.SyncProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "syncProfile", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, roles_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check (público)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "health", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map