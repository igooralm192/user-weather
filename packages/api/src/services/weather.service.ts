import { ZodError } from "zod";
import { Weather } from "@shared/weather";
import { SafeResult } from "@shared/safe";
import { z } from "zod";

export default class WeatherService {
  constructor(private apiKey: string) {}

  async getWeatherByZipcode(zipcode: string): Promise<SafeResult<Weather>> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${this.apiKey}`
      );
      const data = await response.json();
      console.log("DATA", data)
      const getWeatherResponse = await getWeatherResponseSchema.safeParseAsync(
        data
      );
      if (!getWeatherResponse.success) {
        return { error: getWeatherResponse.error };
      }

      const weather = await weatherSchema.safeParseAsync(data);
      if (!weather.success) {
        return { error: weather.error };
      }

      return { data: weather.data };
    } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.errors };
      }
      console.error(error);
      return { error: "Internal server error" };
    }
  }
}

const getWeatherResponseSchema = z.object({
  cod: z.number(),
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
  cod: z.number(),
});
