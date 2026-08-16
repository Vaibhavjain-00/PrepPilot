import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    expectedAnswer: {
      type: String,
      default: "",
    },

    candidateAnswer: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["coding", "oral"],
      required: true,
    },

    score: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model(
  "Question",
  questionSchema
);