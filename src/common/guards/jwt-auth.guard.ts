import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private supabase: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Validar con Supabase (soporta ES256 y HS256 dinámicamente)
    const { data: { user }, error } = await this.supabase.getAdminClient().auth.getUser(token);
    
    if (error || !user) {
      throw new UnauthorizedException('Token inválido o expirado (' + (error?.message || '') + ')');
    }

    // Obtener información adicional de la DB
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, tenantId: true, role: true, isActive: true },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo en base de datos');
    }

    request.user = {
      id: dbUser.id,
      email: dbUser.email,
      tenantId: dbUser.tenantId,
      role: dbUser.role,
    };
    
    return true;
  }
}
