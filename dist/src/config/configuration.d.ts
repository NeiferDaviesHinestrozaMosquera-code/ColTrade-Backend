import * as Joi from 'joi';
export declare const validationSchema: Joi.ObjectSchema<any>;
declare const _default: () => {
    port: number;
    nodeEnv: string | undefined;
    supabase: {
        url: string | undefined;
        anonKey: string | undefined;
        serviceRoleKey: string | undefined;
    };
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
    };
    openai: {
        apiKey: string | undefined;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        prices: {
            pro: string | undefined;
            pymes: string | undefined;
            empresarial: string | undefined;
        };
    };
    redis: {
        host: string;
        port: number;
    };
    trm: {
        apiUrl: string | undefined;
    };
};
export default _default;
