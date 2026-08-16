import {asyncHandler} from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import {User} from "../models/user.js";
import {Interview} from "../models/interview.js";
import {Evaluation} from "../models/evaluation.js";

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // --------------------------------
  // USER
  // --------------------------------

  const user = await User.findById(userId).select(
    "-password -refreshToken"
  );

  if (!user) {
    return res.status(404).json(
      new ApiResponse(
        404,
        null,
        "User not found"
      )
    );
  }

  // --------------------------------
  // INTERVIEW STATISTICS
  // --------------------------------

  const evaluations = await Evaluation.find({
    userId,
  })
    .populate({
      path: "interviewId",
      select:
        "role company difficulty questionCount createdAt",
    })
    .sort({
      createdAt: -1,
    });

  const totalInterviews =
    evaluations.length;

  const scores = evaluations
    .map(
      (evaluation) =>
        evaluation.overallScore
    )
    .filter(
      (score) =>
        typeof score === "number"
    );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / scores.length
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  // --------------------------------
  // RECENT INTERVIEWS
  // --------------------------------

  const recentInterviews =
    evaluations
      .slice(0, 5)
      .map((evaluation) => ({
        evaluationId:
          evaluation._id,

        interviewId:
          evaluation.interviewId?._id,

        role:
          evaluation.interviewId?.role,

        company:
          evaluation.interviewId?.company,

        difficulty:
          evaluation.interviewId?.difficulty,

        questionCount:
          evaluation.interviewId
            ?.questionCount,

        score:
          evaluation.overallScore,

        createdAt:
          evaluation.createdAt,
      }));

  // --------------------------------
  // ACTIVE INTERVIEW
  // --------------------------------

  const activeInterview =
    await Interview.findOne({
      userId,
      status: "in-progress",
    })
      .select(
        "role company difficulty questionCount codingQuestionCount oralQuestionCount createdAt"
      )
      .sort({
        createdAt: -1,
      });

  // --------------------------------
  // RESPONSE
  // --------------------------------

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        interviews: {
          total: totalInterviews,
          averageScore,
          bestScore,
        },
        activeInterview,
        recentInterviews,
      },
      "Dashboard data fetched successfully"
    )
  );
});

export {
  getDashboard,
};