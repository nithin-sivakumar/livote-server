import { Poll } from "../../models/poll.model.js";
import { Room } from "../../models/room.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const getPoll = async (req, res) => {
  try {
    const { roomId } = req.params;

    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) {
      return res
        .status(404)
        .send(new ApiResponse(404, null, "Invalid room id."));
    }

    const poll = await Poll.findById(existingRoom.poll);

    if (!poll) {
      return res
        .status(404)
        .send(new ApiResponse(404, null, "Invalid poll id."));
    }

    res
      .status(200)
      .send(new ApiResponse(200, poll, "Poll results fetched successfully."));
  } catch (error) {
    console.log(error);
    res.status(500).send(new ApiResponse(500, error, "Failed to create room."));
  }
};

export default getPoll;
