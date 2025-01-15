import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.route.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://livote-client.vercel.app",
      "https://livote-server.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", indexRouter);

export default app;
