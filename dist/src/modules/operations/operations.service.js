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
var OperationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OperationsService = OperationsService_1 = class OperationsService {
    prisma;
    logger = new common_1.Logger(OperationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, dto) {
        return this.prisma.operation.create({
            data: {
                ...dto,
                userId,
                tenantId,
                valueUsd: dto.valueUsd ? dto.valueUsd : undefined,
                weightKg: dto.weightKg ? dto.weightKg : undefined,
                eta: dto.eta ? new Date(dto.eta) : undefined,
            },
        });
    }
    async findAll(tenantId, opts) {
        const { status, type, page, limit } = opts;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            ...(status && { status }),
            ...(type && { type }),
        };
        const [data, total] = await Promise.all([
            this.prisma.operation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { documents: true },
            }),
            this.prisma.operation.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(tenantId, id) {
        const operation = await this.prisma.operation.findFirst({
            where: { id, tenantId },
            include: { documents: true, user: { select: { fullName: true, email: true } } },
        });
        if (!operation)
            throw new common_1.NotFoundException(`Operación ${id} no encontrada`);
        return operation;
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        return this.prisma.operation.update({
            where: { id },
            data: {
                ...dto,
                valueUsd: dto.valueUsd ? dto.valueUsd : undefined,
                weightKg: dto.weightKg ? dto.weightKg : undefined,
                eta: dto.eta ? new Date(dto.eta) : undefined,
            },
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        await this.prisma.operation.delete({ where: { id } });
    }
    async generatePdf(tenantId, id) {
        const operation = await this.findOne(tenantId, id);
        this.logger.log(`Generando PDF para operación ${id}`);
        return { message: 'PDF en cola de generación', operationId: id };
    }
};
exports.OperationsService = OperationsService;
exports.OperationsService = OperationsService = OperationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OperationsService);
//# sourceMappingURL=operations.service.js.map