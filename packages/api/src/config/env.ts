import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  WEATHER_API_KEY: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
});

export const env = envSchema.parse(process.env);
