import express from "express";
import { ZodError } from "zod";

import { env } from "./config/env";
import UserRepository from "./repositories/user.repository";
import { createUserSchema, updateUserSchema } from "./schemas";
import WeatherService from "./services/weather.service";
import { User } from "@shared/user";

const userRouter: express.Router = express.Router();
const userRepo = new UserRepository();
const weatherService = new WeatherService(env.WEATHER_API_KEY);

userRouter.get("/", async (req, res) => {
  const usersResponse = await userRepo.getAllUsers();
  if ("error" in usersResponse) {
    return res.status(400).json({ error: usersResponse.error });
  }

  const { data: users } = usersResponse;
  return res.json({ data: users });
});

userRouter.post("/", async (req, res) => {
  try {
    const { success, data, error } = await createUserSchema.safeParseAsync(
      req.body
    );

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const weatherResponse = await weatherService.getWeatherByZipcode(
      data.zipcode
    );
    if ("error" in weatherResponse) {
      return res.status(400).json({ error: weatherResponse.error });
    }

    const { data: weather } = weatherResponse;

    const userResponse = await userRepo.createUser({
      name: data.name,
      zipcode: data.zipcode,
      latitude: weather.coord.lat,
      longitude: weather.coord.lon,
      timezone: weather.timezone,
    });

    if ("error" in userResponse) {
      return res.status(400).json({ error: userResponse.error });
    }

    const { data: user } = userResponse;

    return res.json({ data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const { success, data, error } = await updateUserSchema.safeParseAsync(
      req.body
    );

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const currentUserResponse = await userRepo.getUserById(req.params.id);
    if ("error" in currentUserResponse) {
      return res.status(404).json({ error: currentUserResponse.error });
    }

    const { data: currentUser } = currentUserResponse;

    let newUserData: Partial<Omit<User, "id">> = {
      name: data.name,
      zipcode: data.zipcode,
    };

    if (data.zipcode && data.zipcode !== currentUser.zipcode) {
      const weatherResponse = await weatherService.getWeatherByZipcode(
        data.zipcode
      );
      if ("error" in weatherResponse) {
        return res.status(400).json({ error: weatherResponse.error });
      }

      const { data: weather } = weatherResponse;

      newUserData = {
        ...newUserData,
        latitude: weather.coord.lat,
        longitude: weather.coord.lon,
        timezone: weather.timezone,
      };
    }

    const userResponse = await userRepo.updateUser(req.params.id, newUserData);
    if ("error" in userResponse) {
      return res.status(400).json({ error: userResponse.error });
    }

    const { data: user } = userResponse;

    return res.json({ data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const userResponse = await userRepo.deleteUser(req.params.id);
    if ("error" in userResponse) {
      return res.status(404).json({ error: userResponse.error });
    }
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
