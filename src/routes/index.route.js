import express from "express";
import roomRouter from "./room.route.js";
import pollRouter from "./poll.route.js";

const indexRouter = express.Router();

indexRouter.use("/api/rooms", roomRouter);

indexRouter.use("/api/poll", pollRouter);

indexRouter.get("/", (req, res) => {
  res.send(`<h2>Oh! It's you, hi!</h2>`);
});

export default indexRouter;
