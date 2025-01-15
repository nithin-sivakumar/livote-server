import express from "express";
import roomRouter from "./room.route.js";
import pollRouter from "./poll.route.js";

const indexRouter = express.Router();

indexRouter.use("/api/rooms", roomRouter);

indexRouter.use("/api/poll", pollRouter);

export default indexRouter;
