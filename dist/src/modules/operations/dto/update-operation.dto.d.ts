import { CreateOperationDto } from './create-operation.dto';
import { OperationStatus } from '@prisma/client';
declare const UpdateOperationDto_base: import("@nestjs/common").Type<Partial<CreateOperationDto>>;
export declare class UpdateOperationDto extends UpdateOperationDto_base {
    status?: OperationStatus;
}
export {};
