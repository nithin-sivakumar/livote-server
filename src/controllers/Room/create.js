import { Room } from "../../models/room.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const createRoom = async (req, res) => {
  try {
    const { hostName } = req.body;

    let randomId = "xxx-xxx-xxx".replace(/[x]/g, () =>
      ((Math.random() * 36) | 0).toString(36)
    );

    const alreadyExists = await Room.findOne({ roomId: randomId });

    while (alreadyExists) {
      randomId = "xxx-xxx-xxx".replace(/[x]/g, () =>
        ((Math.random() * 36) | 0).toString(36)
      );

      alreadyExists = await Room.findOne({ roomId: randomId });
    }

    const created = await Room.create({
      roomId: randomId,
      createdBy: hostName,
    });

    res
      .status(201)
      .send(new ApiResponse(201, created, "Room created successfully."));
  } catch (error) {
    console.log(error);
    res.status(500).send(new ApiResponse(500, error, "Failed to create room."));
  }
};

export default createRoom;
