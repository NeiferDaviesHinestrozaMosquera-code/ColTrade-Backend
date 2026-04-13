import { Test, TestingModule } from '@nestjs/testing';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { OperationStatus, OperationType } from '@prisma/client';

describe('OperationsController', () => {
  let controller: OperationsController;
  let service: OperationsService;

  const mockOperationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    generatePdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [
        {
          provide: OperationsService,
          useValue: mockOperationsService,
        },
      ],
    }).compile();

    controller = module.get<OperationsController>(OperationsController);
    service = module.get<OperationsService>(OperationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an operation', async () => {
    const user = { id: 'u1' } as any;
    const dto = { referenceNumber: '123' } as any;
    const tenantId = 't1';
    mockOperationsService.create.mockResolvedValue('created');
    expect(await controller.create(user, tenantId, dto)).toBe('created');
    expect(service.create).toHaveBeenCalledWith(user.id, tenantId, dto);
  });

  it('should find all operations', async () => {
    const tenantId = 't1';
    const status = OperationStatus.PENDING;
    const type = OperationType.IMPORT;
    const page = 1;
    const limit = 20;

    mockOperationsService.findAll.mockResolvedValue('found');
    expect(await controller.findAll(tenantId, status, type, page, limit)).toBe('found');
    expect(service.findAll).toHaveBeenCalledWith(tenantId, { status, type, page, limit });
  });

  it('should find one operation', async () => {
    const tenantId = 't1';
    const id = 'o1';
    mockOperationsService.findOne.mockResolvedValue('found_one');
    expect(await controller.findOne(tenantId, id)).toBe('found_one');
    expect(service.findOne).toHaveBeenCalledWith(tenantId, id);
  });

  it('should update an operation', async () => {
    const tenantId = 't1';
    const id = 'o1';
    const dto = { status: OperationStatus.IN_PROGRESS } as any;
    mockOperationsService.update.mockResolvedValue('updated');
    expect(await controller.update(tenantId, id, dto)).toBe('updated');
    expect(service.update).toHaveBeenCalledWith(tenantId, id, dto);
  });

  it('should remove an operation', async () => {
    const tenantId = 't1';
    const id = 'o1';
    mockOperationsService.remove.mockResolvedValue('removed');
    expect(await controller.remove(tenantId, id)).toBe('removed');
    expect(service.remove).toHaveBeenCalledWith(tenantId, id);
  });

  it('should generate pdf', async () => {
    const tenantId = 't1';
    const id = 'o1';
    mockOperationsService.generatePdf.mockResolvedValue('pdf');
    expect(await controller.generatePdf(tenantId, id)).toBe('pdf');
    expect(service.generatePdf).toHaveBeenCalledWith(tenantId, id);
  });
});
