import { Room } from "./models/room.model.js";

export const socketHandler = (client, io) => {
  const handleRoomJoin = async ({ roomId, name }) => {
    if (roomId.trim() === "") {
      client.emit("error", "Invalid room id. Please try again.");
      return;
    }

    client.join(roomId);

    const room = await Room.findOneAndUpdate(
      { roomId },
      { isActive: true },
      { new: true }
    );

    if (!room) {
      client.emit("error", "Invalid room ID. Please try again.");
      return;
    }

    io.to(roomId).emit("notification", `${name} has joined the room`);

    // client.emit("notification", `Welcome, ${name}. You have joined the room.`);
  };

  client.on("joinRoom", handleRoomJoin);
};
