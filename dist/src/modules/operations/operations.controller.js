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
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const operations_service_1 = require("./operations.service");
const create_operation_dto_1 = require("./dto/create-operation.dto");
const update_operation_dto_1 = require("./dto/update-operation.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const client_1 = require("@prisma/client");
let OperationsController = class OperationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(user, tenantId, dto) {
        return this.service.create(user.id, tenantId, dto);
    }
    findAll(tenantId, status, type, page = 1, limit = 20) {
        return this.service.findAll(tenantId, { status, type, page: +page, limit: +limit });
    }
    findOne(tenantId, id) {
        return this.service.findOne(tenantId, id);
    }
    update(tenantId, id, dto) {
        return this.service.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.service.remove(tenantId, id);
    }
    generatePdf(tenantId, id) {
        return this.service.generatePdf(tenantId, id);
    }
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear operación de importación/exportación' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, current_user_decorator_1.TenantId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_strategy_1.AuthenticatedUser, String, create_operation_dto_1.CreateOperationDto]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.OperationStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: client_1.OperationType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'Listar operaciones del tenant' }),
    __param(0, (0, current_user_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una operación por ID' }),
    __param(0, (0, current_user_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar operación' }),
    __param(0, (0, current_user_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_operation_dto_1.UpdateOperationDto]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar/eliminar operación' }),
    __param(0, (0, current_user_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/generate-pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar PDF de resumen de operación' }),
    __param(0, (0, current_user_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "generatePdf", null);
exports.OperationsController = OperationsController = __decorate([
    (0, swagger_1.ApiTags)('Operations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('operations'),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map