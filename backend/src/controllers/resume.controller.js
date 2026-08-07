import { Resume } from "../models/resume.js";
import { User } from "../models/user.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

import { parseResume } from "../services/resumeParser.service.js";
import { parseResumeWithAI } from "../services/aiResumeParser.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  let uploadedResume = null;

  try {
    // 1. Extract Text

    const extractedText = await parseResume(req.file);

    if (!extractedText) {
      throw new ApiError(400, "Unable to extract resume text");
    }

    // 2. Upload Resume to Cloudinary

    uploadedResume = await uploadToCloudinary(
      req.file.buffer,
      "PrepPilot/resumes",
    );

    if (!uploadedResume) {
      throw new ApiError(500, "Failed to upload resume");
    }

    // 3. Parse Resume using AI

    const aiData = await parseResumeWithAI(extractedText);

    // 4. Find Existing Resume

    const existingResume = await Resume.findOne({
      userId: req.user._id,
    });

    let finalResume = null;
    let oldPublicId = null;

    if (existingResume) {
      oldPublicId = existingResume.publicId;

      existingResume.fileUrl = uploadedResume.secure_url;
      existingResume.publicId = uploadedResume.public_id;

      existingResume.extractedText = extractedText;

      existingResume.skills = aiData.skills || [];

      existingResume.education = aiData.education || [];

      existingResume.experience = aiData.experience || [];

      existingResume.projects = aiData.projects || [];

      existingResume.status = "parsed";

      existingResume.parsedAt = new Date();

      finalResume = await existingResume.save();
    } else {
      finalResume = await Resume.create({
        userId: req.user._id,

        fileUrl: uploadedResume.secure_url,

        publicId: uploadedResume.public_id,

        extractedText,

        skills: aiData.skills || [],

        education: aiData.education || [],

        experience: aiData.experience || [],

        projects: aiData.projects || [],

        status: "parsed",

        parsedAt: new Date(),
      });
    }

    // 5. Store Resume ID in User

    await User.findByIdAndUpdate(
      req.user._id,
      {
        resume: finalResume._id,
      },
      {
        new: true,
      },
    );

    // 6. Delete Old Resume From Cloudinary

    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch (error) {
        console.log("Old resume deletion failed:", error.message);
      }
    }

    // 7. Response

    return res.status(200).json(
      new ApiResponse(
        200,

        {
          resume: finalResume,
        },

        "Resume uploaded and parsed successfully",
      ),
    );
  } catch (error) {
    // Cleanup Uploaded File

    if (uploadedResume?.public_id) {
      try {
        await deleteFromCloudinary(uploadedResume.public_id);
      } catch (cleanupError) {
        console.log("Cloudinary cleanup failed:", cleanupError.message);
      }
    }

    throw error;
  }
});

const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,

      resume,

      "Resume fetched successfully",
    ),
  );
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.publicId) {
    await deleteFromCloudinary(resume.publicId);
  }

  await Resume.findByIdAndDelete(resume._id);

  // Remove Resume Reference from User

  await User.findByIdAndUpdate(
    req.user._id,

    {
      $unset: {
        resume: 1,
      },
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      {},

      "Resume deleted successfully",
    ),
  );
});

const updateResume = asyncHandler(async (req, res) => {
  const { skills, education, experience,projects } = req.body;

  if (!skills && !education && !experience && !projects) {
    throw new ApiError(400, "Nothing to update");
  }

  const resume = await Resume.findOne({
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  resume.skills = skills ?? resume.skills;

  resume.education = education ?? resume.education;

  resume.experience = experience ?? resume.experience;

  resume.projects = experience ?? resume.projects;

  await resume.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      resume,

      "Resume updated successfully",
    ),
  );
});

export { uploadResume, getResume, deleteResume, updateResume };
