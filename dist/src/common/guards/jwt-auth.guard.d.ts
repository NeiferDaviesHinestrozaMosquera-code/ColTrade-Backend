import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private supabase;
    private prisma;
    constructor(reflector: Reflector, supabase: SupabaseService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
