import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SyncProfileDto } from './dto/sync-profile.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly supabase;
    private readonly logger;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            tenant: {
                id: string;
                name: string;
                slug: string;
                planTier: import(".prisma/client").$Enums.PlanTier;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            tenant: {
                id: string;
                name: string;
                slug: string;
                planTier: import(".prisma/client").$Enums.PlanTier;
            };
        };
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    syncProfile(userId: string, email: string, dto: SyncProfileDto): Promise<{
        user: {
            tenant: {
                id: string;
                name: string;
                slug: string;
                planTier: import(".prisma/client").$Enums.PlanTier;
            };
        } & {
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            id: string;
            tenantId: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        tenant: {
            nit: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            stripeCustomerId: string | null;
            stripeSubscriptionId: string | null;
            logoUrl: string | null;
            planTier: import(".prisma/client").$Enums.PlanTier;
        };
    }>;
    getMe(userId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
            planTier: import(".prisma/client").$Enums.PlanTier;
        };
    } & {
        email: string;
        fullName: string | null;
        avatarUrl: string | null;
        id: string;
        tenantId: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
