import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),

  HISTORY_EXPIRATION_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 60 * 24),

  MAX_CHUNK_SIZE_IN_CHARS: z.coerce.number().int().positive().default(1500),

  PROJECTS_BASE_DIR: z.string().min(1).default('.'),
});

export const env = envSchema.parse(process.env);
