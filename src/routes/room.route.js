import express from "express";
import roomController from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.route("/").post(roomController.create);

export default roomRouter;
