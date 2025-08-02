import express from "express";
import cors from "cors";

import userRouter from "./routers/user.router";
import { env } from "./config/env";
import { cleanTestDb } from "./config/firebase";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", userRouter);

app.post("/api/e2e/clean", async (req, res) => {
  if (env.NODE_ENV !== "test") {
    return res
      .status(400)
      .json({ error: "This endpoint is only available in test environment" });
  }

  await cleanTestDb();

  return res.json({ status: "ok" });
});

export default app;
