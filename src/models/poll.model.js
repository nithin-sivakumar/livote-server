import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [pollOptionSchema],
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Poll = mongoose.model("Poll", pollSchema);
