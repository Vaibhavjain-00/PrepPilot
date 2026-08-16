import mongoose, { Schema } from "mongoose";

const evaluationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        question: {
          type: String,
          required: true,
        },

        category: {
          type: String,
          enum: ["coding", "oral"],
          required: true,
        },

        candidateAnswer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
        },

        feedback: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Evaluation = mongoose.model(
  "Evaluation",
  evaluationSchema
);