import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private adminClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const serviceRoleKey = this.configService.get<string>(
      'supabase.serviceRoleKey',
    );

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos',
      );
    }

    this.adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    this.logger.log('✅ Supabase Admin Client inicializado');
  }

  /**
   * Retorna el cliente Supabase completo con privilegios de Service Role.
   * Usa esto para: Auth Admin, Storage, consultas directas, etc.
   */
  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }
}
