import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
    pollHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model("Room", roomSchema);
