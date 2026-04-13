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
exports.SyncProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SyncProfileDto {
    tenantSlug;
    tenantName;
    nit;
    fullName;
    avatarUrl;
}
exports.SyncProfileDto = SyncProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slug único de la empresa (e.g. "empresa-abc")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "tenantSlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre comercial de la empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "tenantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'NIT de la empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "nit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre completo del usuario' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL del avatar del usuario' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "avatarUrl", void 0);
//# sourceMappingURL=sync-profile.dto.js.map