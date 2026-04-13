import {
  Controller, Get, Post, Put, Delete, Body,
  Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { CurrentUser, TenantId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { OperationStatus, OperationType } from '@prisma/client';

@ApiTags('Operations')
@ApiBearerAuth()
@Controller('operations')
export class OperationsController {
  constructor(private readonly service: OperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear operación de importación/exportación' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
    @Body() dto: CreateOperationDto,
  ) {
    return this.service.create(user.id, tenantId, dto);
  }

  @Get()
  @ApiQuery({ name: 'status', enum: OperationStatus, required: false })
  @ApiQuery({ name: 'type', enum: OperationType, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOperation({ summary: 'Listar operaciones del tenant' })
  findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: OperationStatus,
    @Query('type') type?: OperationType,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.service.findAll(tenantId, { status, type, page: +page, limit: +limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una operación por ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar operación' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOperationDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar/eliminar operación' })
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }

  @Post(':id/generate-pdf')
  @ApiOperation({ summary: 'Generar PDF de resumen de operación' })
  generatePdf(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.generatePdf(tenantId, id);
  }
}
