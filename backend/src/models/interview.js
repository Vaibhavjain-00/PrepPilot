import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    language: {
      type: String,
      enum: ["english", "hinglish"],
      default: "english",
    },

    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    questionCount: {
      type: Number,
      enum: [5, 10, 15],
      required: true,
    },

    codingQuestionCount: {
      type: Number,
      required: true,
    },

    oralQuestionCount: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["in-progress", "evaluating", "completed"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model(
  "Interview",
  interviewSchema
);