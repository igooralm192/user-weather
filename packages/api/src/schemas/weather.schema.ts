import { Weather } from "@shared/weather";
import { z } from "zod";

export const getWeatherResponseSchema = z.object({
  cod: z.coerce.number(),
  message: z.string().optional(),
});

export const weatherSchema: z.ZodType<Weather> = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.coerce.number(),
});
