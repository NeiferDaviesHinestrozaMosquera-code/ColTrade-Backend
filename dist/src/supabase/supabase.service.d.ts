import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private adminClient;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getAdminClient(): SupabaseClient;
}
