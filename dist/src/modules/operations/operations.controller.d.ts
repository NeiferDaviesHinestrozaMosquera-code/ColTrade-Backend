import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { OperationStatus, OperationType } from '@prisma/client';
export declare class OperationsController {
    private readonly service;
    constructor(service: OperationsService);
    create(user: AuthenticatedUser, tenantId: string, dto: CreateOperationDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.OperationType;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        blNumber: string | null;
        nandinaCode: string | null;
        originCountry: string | null;
        destCountry: string | null;
        valueUsd: import("@prisma/client-runtime-utils").Decimal | null;
        weightKg: import("@prisma/client-runtime-utils").Decimal | null;
        customsPort: string | null;
        eta: Date | null;
        status: import(".prisma/client").$Enums.OperationStatus;
        declarantId: string | null;
        pdfUrl: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
    }>;
    findAll(tenantId: string, status?: OperationStatus, type?: OperationType, page?: number, limit?: number): Promise<{
        data: ({
            documents: {
                id: string;
                createdAt: Date;
                name: string;
                operationId: string;
                fileUrl: string;
                fileType: string;
                sizeBytes: number;
            }[];
        } & {
            description: string | null;
            type: import(".prisma/client").$Enums.OperationType;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            blNumber: string | null;
            nandinaCode: string | null;
            originCountry: string | null;
            destCountry: string | null;
            valueUsd: import("@prisma/client-runtime-utils").Decimal | null;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            customsPort: string | null;
            eta: Date | null;
            status: import(".prisma/client").$Enums.OperationStatus;
            declarantId: string | null;
            pdfUrl: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(tenantId: string, id: string): Promise<{
        user: {
            email: string;
            fullName: string | null;
        };
        documents: {
            id: string;
            createdAt: Date;
            name: string;
            operationId: string;
            fileUrl: string;
            fileType: string;
            sizeBytes: number;
        }[];
    } & {
        description: string | null;
        type: import(".prisma/client").$Enums.OperationType;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        blNumber: string | null;
        nandinaCode: string | null;
        originCountry: string | null;
        destCountry: string | null;
        valueUsd: import("@prisma/client-runtime-utils").Decimal | null;
        weightKg: import("@prisma/client-runtime-utils").Decimal | null;
        customsPort: string | null;
        eta: Date | null;
        status: import(".prisma/client").$Enums.OperationStatus;
        declarantId: string | null;
        pdfUrl: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateOperationDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.OperationType;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        blNumber: string | null;
        nandinaCode: string | null;
        originCountry: string | null;
        destCountry: string | null;
        valueUsd: import("@prisma/client-runtime-utils").Decimal | null;
        weightKg: import("@prisma/client-runtime-utils").Decimal | null;
        customsPort: string | null;
        eta: Date | null;
        status: import(".prisma/client").$Enums.OperationStatus;
        declarantId: string | null;
        pdfUrl: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
    }>;
    remove(tenantId: string, id: string): Promise<void>;
    generatePdf(tenantId: string, id: string): Promise<{
        message: string;
        operationId: string;
    }>;
}
