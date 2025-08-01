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

      const getWeatherResponse = await getWeatherResponseSchema.safeParseAsync(
        data
      );
      if (!getWeatherResponse.success) {
        console.error(getWeatherResponse.error);
        return {
          error: {
            message: "Weather service: Error on parsing get weather response",
            status: 500,
          },
        };
      }

      if (getWeatherResponse.data.cod !== 200) {
        const errorMessage =
          getWeatherResponse.data.message || "Bad request on getting weather";
        return {
          error: {
            message: `Weather service: ${errorMessage}`,
            status: 400,
          },
        };
      }

      const weather = await weatherSchema.safeParseAsync(data);
      if (!weather.success) {
        console.error(weather.error);
        return {
          error: {
            message: "Weather service: Error on parsing weather",
            status: 500,
          },
        };
      }

      return { data: weather.data };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "Weather service: Internal server error",
          status: 500,
        },
      };
    }
  }
}

const getWeatherResponseSchema = z.object({
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
