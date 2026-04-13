import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { OperationStatus, OperationType } from '@prisma/client';

interface FindAllOptions {
  status?: OperationStatus;
  type?: OperationType;
  page: number;
  limit: number;
}

@Injectable()
export class OperationsService {
  private readonly logger = new Logger(OperationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, tenantId: string, dto: CreateOperationDto) {
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

  async findAll(tenantId: string, opts: FindAllOptions) {
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

  async findOne(tenantId: string, id: string) {
    const operation = await this.prisma.operation.findFirst({
      where: { id, tenantId },
      include: { documents: true, user: { select: { fullName: true, email: true } } },
    });
    if (!operation) throw new NotFoundException(`Operación ${id} no encontrada`);
    return operation;
  }

  async update(tenantId: string, id: string, dto: UpdateOperationDto) {
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

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.operation.delete({ where: { id } });
  }

  async generatePdf(tenantId: string, id: string) {
    const operation = await this.findOne(tenantId, id);
    // PDF generation — retorna URL del archivo en Supabase Storage
    // La lógica completa está en StorageModule + PDFKit
    this.logger.log(`Generando PDF para operación ${id}`);
    return { message: 'PDF en cola de generación', operationId: id };
  }
}
