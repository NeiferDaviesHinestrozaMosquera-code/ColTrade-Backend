import { OperationType } from '@prisma/client';
export declare class CreateOperationDto {
    type: OperationType;
    blNumber?: string;
    nandinaCode?: string;
    originCountry?: string;
    destCountry?: string;
    valueUsd?: number;
    weightKg?: number;
    description?: string;
    customsPort?: string;
    eta?: string;
}
