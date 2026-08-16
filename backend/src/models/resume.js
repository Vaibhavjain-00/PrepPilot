import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        year: String,
        score:String
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],

    projects: [
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
  },
],

    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],

    status: {
      type: String,
      enum: ["uploaded", "parsed", "failed"],
      default: "uploaded",
    },

    parsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Resume = mongoose.model("Resume", resumeSchema);