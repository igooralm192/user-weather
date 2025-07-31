import { z } from "zod";
import { User } from "@shared/user";

export const userSchema: z.ZodType<User> = z.object({
  id: z.string(),
  name: z.string(),
  zipcode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.number(),
});

export const createUserSchema = z.object({
  name: z.string(),
  zipcode: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  zipcode: z.string().optional(),
});
