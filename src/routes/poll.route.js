import express from "express";
import pollController from "../controllers/poll.controller.js";

const pollRouter = express.Router();

pollRouter.route("/:roomId").get(pollController.get);

export default pollRouter;
