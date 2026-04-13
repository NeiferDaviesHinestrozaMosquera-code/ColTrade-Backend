import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SyncProfileDto } from './dto/sync-profile.dto';
import { AuthenticatedUser } from './strategies/jwt.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    getMe(user: AuthenticatedUser): Promise<{
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
    syncProfile(user: AuthenticatedUser, dto: SyncProfileDto): Promise<{
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
    health(): {
        status: string;
        service: string;
        version: string;
    };
}
