import express from "express";
import { ZodError } from "zod";

import { env } from "./config/env";
import UserRepository from "./repositories/user.repository";
import { createUserSchema } from "./schemas";
import WeatherService from "./services/weather.service";

const userRouter: express.Router = express.Router();
const userRepo = new UserRepository();
const weatherService = new WeatherService(env.WEATHER_API_KEY);

userRouter.get("/", async (req, res) => {
  const { data: users } = await userRepo.getAllUsers();
  res.json({ data: users });
});

userRouter.post("/", async (req, res) => {
  try {
    const { success, data, error } = await createUserSchema.safeParseAsync(req.body);

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const weatherResponse = await weatherService.getWeatherByZipcode(data.zipcode);
    if ("error" in weatherResponse) {
      return res.status(400).json({ error: weatherResponse.error });
    }

    const { data: weather } = weatherResponse;

    const { data: user } = await userRepo.createUser({
      name: data.name,
      zipcode: data.zipcode,
      latitude: weather.coord.lat,
      longitude: weather.coord.lon,
      timezone: weather.timezone,
    });

    return res.json({ data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
