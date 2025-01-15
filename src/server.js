import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./db/db.connect.js";
import { Room } from "./models/room.model.js";
import { Poll } from "./models/poll.model.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

io.on("connection", (client) => {
  client.on("joinRoom", async ({ roomId, name }) => {
    if (roomId.trim() === "") {
      client.emit("error", "Invalid room id. Please try again.");
      return;
    }

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
    client.join(roomId);
    client.emit("notification", `Welcome, ${name}. You have joined the room.`);
  });

  client.on("pollStart", ({ duration, question, options, roomId }) => {
    io.to(roomId).emit("pollStart", { duration, question, options });

    let timeLeft = duration; // Ensure duration is in seconds (e.g., 60)

    const timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        // console.log(`Sending timer ${timeLeft} to ${roomId}`);
        io.to(roomId).emit("durationUpdate", timeLeft);
        timeLeft--;
      } else {
        clearInterval(timerInterval);
        io.to(roomId).emit("pollEnd");
      }
    }, 1000); // Send update every second
  });

  client.on("silentJoinRoom", ({ roomId, name }) => {
    // console.log(`${name} joined ${roomId}`);
    client.join(roomId);
  });

  client.on("vote", async ({ selected, roomId }) => {
    const exisitingRoom = await Room.findOne({ roomId }).populate("poll");

    let options = exisitingRoom.poll.options;

    let updatedOptions = options.map((item) => {
      return parseInt(item.value) == parseInt(selected)
        ? { ...item, votes: item.votes + 1 }
        : item;
    });

    exisitingRoom.poll.options = updatedOptions;
    await exisitingRoom.poll.save();

    io.to(roomId).emit("notification", "Vote casted");
  });

  client.on("askQuestion", async ({ question, options, roomId, name }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) {
      io.emit("error", "Failed to find room. Please try again later.");
      return;
    }

    const createdPoll = await Poll.create({
      createdBy: name,
      question,
      options,
      roomId,
      isActive: true,
    });

    existingRoom.poll = createdPoll._id;
    existingRoom.pollHistory.push(createdPoll._id);
    await existingRoom.save();

    console.log(existingRoom);

    io.to(roomId).emit(existingRoom.poll);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
});
