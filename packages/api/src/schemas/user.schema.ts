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
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  zipcode: z.string({
    required_error: "Zipcode is required",
    invalid_type_error: "Zipcode must be a string",
  }),
});

export const updateUserSchema = z.object({
  name: z.string({
    invalid_type_error: "Name must be a string",
  }).optional(),
  zipcode: z.string({
    invalid_type_error: "Zipcode must be a string",
  }).optional(),
});
