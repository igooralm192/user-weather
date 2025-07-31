import { z } from "zod";

export const validateEnv = () => {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables: ${result.error.issues
        .map((i) => i.message)
        .join(", ")}`
    );
  }

  return result.data;
};

const envSchema = z.object({
  VITE_API_URL: z.string(),
});

export const env = validateEnv();
