import { Interview } from "../models/interview.js";
import { Question } from "../models/question.js";
import { Resume } from "../models/resume.js";

import {
  generateInterviewQuestions,
} from "../services/aiInterview.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { evaluateInterview } from "../services/aiEvaluation.service.js";
import { Evaluation } from "../models/evaluation.js";

import { evaluationQueue } from "../queues/evaluation.queue.js";
import { interviewQueue } from "../queues/interview.queue.js";


// const generateInterview = asyncHandler(
//   async (req, res) => {
//     const {
//       role,
//       company,
//       difficulty,
//       questionCount,
//       language,
//     } = req.body;

//     /*
//      * Basic validation
//      */

//     if (!role || !role.trim()) {
//       throw new ApiError(
//         400,
//         "Role is required"
//       );
//     }

//     if (
//       !["easy", "medium", "hard"].includes(
//         difficulty
//       )
//     ) {
//       throw new ApiError(
//         400,
//         "Invalid difficulty"
//       );
//     }

//     if (
//       ![5, 10, 15].includes(questionCount)
//     ) {
//       throw new ApiError(
//         400,
//         "Question count must be 5, 10 or 15"
//       );
//     }

//     if (
//       language &&
//       !["english", "hinglish"].includes(
//         language
//       )
//     ) {
//       throw new ApiError(
//         400,
//         "Invalid language"
//       );
//     }

//     /*
//      * Get candidate resume
//      */

//     const resume = await Resume.findOne({
//       userId: req.user._id,
//     });

//     if (!resume) {
//       throw new ApiError(
//         404,
//         "Please upload a resume before generating an interview"
//       );
//     }

//     /*
//      * Generate questions using AI
//      */

//     const aiResult =
//       await generateInterviewQuestions({
//         resume,
//         role: role.trim(),
//         company: company?.trim() || "",
//         difficulty,
//         questionCount,
//         language: language || "english",
//       });

//     /*
//      * Create Interview
//      */

//     const interview =
//       await Interview.create({
//         userId: req.user._id,

//         role: role.trim(),

//         company: company?.trim() || "",

//         difficulty,

//         language: language || "english",

//         questionCount,

//         codingQuestionCount:
//           aiResult.distribution.coding,

//         oralQuestionCount:
//           aiResult.distribution.oral,

//         status: "in-progress",
//       });

//     /*
//      * Create Questions
//      */

//     const questionDocuments =
//       aiResult.questions.map((item) => ({
//         interviewId: interview._id,

//         question: item.question.trim(),

//         expectedAnswer:
//           item.expectedAnswer?.trim() || "",

//         category: item.category,

//         candidateAnswer: "",

//         score: null,
//       }));

//     const createdQuestions =
//       await Question.insertMany(
//         questionDocuments
//       );

//     /*
//      * Store question IDs in Interview
//      */

//     interview.questions =
//       createdQuestions.map(
//         (question) => question._id
//       );

//     await interview.save();

//     /*
//      * Response
//      */

//     return res.status(201).json(
//       new ApiResponse(
//         201,
//         {
//           interview: {
//             _id: interview._id,
//             role: interview.role,
//             company: interview.company,
//             difficulty:
//               interview.difficulty,
//             language: interview.language,

//             questionCount:
//               interview.questionCount,

//             codingQuestionCount:
//               interview.codingQuestionCount,

//             oralQuestionCount:
//               interview.oralQuestionCount,

//             status: interview.status,

//             questions:
//               createdQuestions,
//           },
//         },
//         "Interview generated successfully"
//       )
//     );
//   }
// );

const generateInterview = asyncHandler(
  async (req, res) => {
    const {
      role,
      company,
      difficulty,
      questionCount,
      language,
    } = req.body;

    // ----------------------------------
    // 1. Validation
    // ----------------------------------

    if (!role || !role.trim()) {
      throw new ApiError(
        400,
        "Role is required"
      );
    }

    if (
      !["easy", "medium", "hard"].includes(
        difficulty
      )
    ) {
      throw new ApiError(
        400,
        "Invalid difficulty"
      );
    }

    if (
      ![5, 10, 15].includes(questionCount)
    ) {
      throw new ApiError(
        400,
        "Question count must be 5, 10 or 15"
      );
    }

    if (
      language &&
      !["english", "hinglish"].includes(
        language
      )
    ) {
      throw new ApiError(
        400,
        "Invalid language"
      );
    }

    // ----------------------------------
    // 2. Get resume
    // ----------------------------------

    const resume = await Resume.findOne({
      userId: req.user._id,
    });

    if (!resume) {
      throw new ApiError(
        404,
        "Please upload a resume before generating an interview"
      );
    }

    // ----------------------------------
    // 3. Create interview
    // ----------------------------------

    const interview =
      await Interview.create({
        userId: req.user._id,

        role: role.trim(),

        company:
          company?.trim() || "",

        difficulty,

        language:
          language || "english",

        questionCount,

        codingQuestionCount: 0,

        oralQuestionCount: 0,

        status: "generating",

        questions: [],
      });

    // ----------------------------------
    // 4. Add BullMQ job
    // ----------------------------------

    const job =
      await interviewQueue.add(
        "generate-interview",
        {
          interviewId:
            interview._id.toString(),

          userId:
            req.user._id.toString(),

          resumeId:
            resume._id.toString(),

          role: role.trim(),

          company:
            company?.trim() || "",

          difficulty,

          questionCount,

          language:
            language || "english",
        },
        {
          attempts: 3,

          backoff: {
            type: "exponential",
            delay: 5000,
          },

          removeOnComplete: true,

          removeOnFail: false,
        }
      );

    console.log(
      "========== INTERVIEW GENERATION JOB QUEUED =========="
    );

    console.log(
      "Job ID:",
      job.id
    );

    console.log(
      "Interview ID:",
      interview._id.toString()
    );

    // ----------------------------------
    // 5. Immediate response
    // ----------------------------------

    return res.status(202).json(
      new ApiResponse(
        202,
        {
          jobId: job.id,

          interviewId:
            interview._id,

          status: "generating",
        },

        "Interview generation started"
      )
    );
  }
);  


const getInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;

  const interview = await Interview.findOne({
    _id: interviewId,
    userId: req.user._id,
  }).populate("questions");

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  const questions = interview.questions || [];

  // Find first unanswered question
  let currentQuestionIndex = questions.findIndex(
    (question) => !question.candidateAnswer?.trim()
  );

  // If all questions are answered
  if (currentQuestionIndex === -1) {
    currentQuestionIndex = questions.length - 1;
  }

  const currentQuestion =
    questions[currentQuestionIndex] || null;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
        currentQuestion,
        currentQuestionIndex,
      },
      "Interview fetched successfully"
    )
  );
});

const submitAnswer = asyncHandler(
  async (req, res) => {
    const {
      interviewId,
      questionId,
    } = req.params;

    const { answer } = req.body;

    if (
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      throw new ApiError(
        400,
        "Answer is required"
      );
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    if (
      interview.status !== "in-progress"
    ) {
      throw new ApiError(
        400,
        "Interview is no longer active"
      );
    }

    const question =
      await Question.findOne({
        _id: questionId,
        interviewId,
      });

    if (!question) {
      throw new ApiError(
        404,
        "Question not found"
      );
    }

    /*
     * Save candidate answer
     */

    question.candidateAnswer =
      answer.trim();

    await question.save();

    /*
     * Find current question index
     */

    const currentIndex =
      interview.questions.findIndex(
        (id) =>
          id.toString() ===
          questionId.toString()
      );

    if (currentIndex === -1) {
      throw new ApiError(
        400,
        "Question does not belong to this interview"
      );
    }

    const isLastQuestion =
      currentIndex ===
      interview.questions.length - 1;

    /*
     * Last question
     */

    if (isLastQuestion) {
      interview.status = "evaluating";

      await interview.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            question,

            isLastQuestion: true,

            currentQuestionIndex:
              currentIndex,

            nextQuestion: null,
          },
          "Answer submitted successfully"
        )
      );
    }

    /*
     * Next question
     */

    const nextQuestion =
      await Question.findById(
        interview.questions[
          currentIndex + 1
        ]
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          question,

          isLastQuestion: false,

          currentQuestionIndex:
            currentIndex + 1,

          nextQuestion,
        },
        "Answer submitted successfully"
      )
    );
  }
);


const getActiveInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    userId: req.user._id,
    status: "in-progress",
  })
    .populate("questions")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview,
      },
      interview
        ? "Active interview fetched successfully"
        : "No active interview"
    )
  );
});

// const evaluateInterviewController = asyncHandler(

//   async (req, res) => {
//     const { interviewId } = req.params;

//     // ----------------------------------
//     // 1. Find interview
//     // ----------------------------------

//     const interview = await Interview.findOne({
//       _id: interviewId,
//       userId: req.user._id,
//     });

//     if (!interview) {
//       throw new ApiError(
//         404,
//         "Interview not found"
//       );
//     }

//     // ----------------------------------
//     // 2. Prevent duplicate evaluation
//     // ----------------------------------

//     const existingEvaluation =
//       await Evaluation.findOne({
//         interviewId,
//         userId: req.user._id,
//       });

//     if (existingEvaluation) {
//       return res.status(200).json(
//         new ApiResponse(
//           200,
//           existingEvaluation,
//           "Interview already evaluated"
//         )
//       );
//     }

//     // ----------------------------------
//     // 3. Get questions
//     // ----------------------------------

//     const questions = await Question.find({
//       interviewId: interview._id,
//     }).sort({
//       createdAt: 1,
//     });

//     if (!questions.length) {
//       throw new ApiError(
//         400,
//         "No questions found for this interview"
//       );
//     }

//     // ----------------------------------
//     // 4. Mark as evaluating
//     // ----------------------------------

//     interview.status = "evaluating";

//     await interview.save();

//     // ----------------------------------
//     // 5. AI Evaluation
//     // ----------------------------------

//     const evaluation =
//       await evaluateInterview({
//         interview,
//         questions,
//       });

//     // ----------------------------------
//     // 6. Validate AI response
//     // ----------------------------------

//     if (
//       !evaluation ||
//       !Array.isArray(
//         evaluation.evaluatedQuestions
//       )
//     ) {
//       interview.status = "in-progress";
//       await interview.save();

//       throw new ApiError(
//         500,
//         "Invalid AI evaluation response"
//       );
//     }

//     if (
//       evaluation.evaluatedQuestions.length !==
//       questions.length
//     ) {
//       interview.status = "in-progress";
//       await interview.save();

//       throw new ApiError(
//         500,
//         "AI did not evaluate all questions"
//       );
//     }

//     // ----------------------------------
//     // 7. Map AI evaluation
//     // ----------------------------------

//     const evaluationQuestions =
//       evaluation.evaluatedQuestions
//         .map((item) => {
//           const index =
//             Number(item.questionNumber) - 1;

//           const question =
//             questions[index];

//           if (!question) {
//             return null;
//           }

//           let score = Number(item.score);

//           // Safety
//           if (Number.isNaN(score)) {
//             score = 0;
//           }

//           if (score < 0) {
//             score = 0;
//           }

//           if (score > 10) {
//             score = 10;
//           }

//           return {
//             questionId: question._id,

//             question: question.question,

//             category: question.category,

//             candidateAnswer:
//               question.candidateAnswer || "",

//             score,

//             feedback:
//               item.feedback || "",
//           };
//         })
//         .filter(Boolean);

//     // ----------------------------------
//     // 8. Make sure all questions mapped
//     // ----------------------------------

//     if (
//       evaluationQuestions.length !==
//       questions.length
//     ) {
//       interview.status = "in-progress";

//       await interview.save();

//       throw new ApiError(
//         500,
//         "Failed to map AI evaluation to questions"
//       );
//     }

//     // ----------------------------------
//     // 9. Calculate overall score
//     // ----------------------------------

//     const totalScore =
//       evaluationQuestions.reduce(
//         (sum, item) =>
//           sum + item.score,
//         0
//       );

//     const maxScore =
//       questions.length * 10;

//     const overallScore = Math.round(
//       (totalScore / maxScore) * 100
//     );

//     // ----------------------------------
//     // 10. Create Evaluation document
//     // ----------------------------------

//     const evaluationDocument =
//       await Evaluation.create({
//         userId: req.user._id,

//         interviewId: interview._id,

//         overallScore: overallScore,

//         overallFeedback:
//           evaluation.overallFeedback || "",

//         questions: evaluationQuestions,
//       });

//     // ----------------------------------
//     // 11. Update individual question scores
//     // ----------------------------------

//     for (
//       const evaluatedQuestion
//       of evaluationQuestions
//     ) {
//       await Question.findByIdAndUpdate(
//         evaluatedQuestion.questionId,
//         {
//           score:
//             evaluatedQuestion.score,
//         }
//       );
//     }

//     // ----------------------------------
//     // 12. Mark interview completed
//     // ----------------------------------

//     interview.status = "completed";

//     interview.score = overallScore;

//     interview.feedback =
//       evaluation.overallFeedback || "";

//     await interview.save();

//     // ----------------------------------
//     // 13. Send response
//     // ----------------------------------

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         evaluationDocument,
//         "Interview evaluated successfully"
//       )
//     );
// });

 const evaluateInterviewController = asyncHandler(
  async (req, res) => {
    const { interviewId } = req.params;

    // ----------------------------------
    // 1. Find interview
    // ----------------------------------

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user._id,
    });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    // ----------------------------------
    // 2. Prevent duplicate evaluation
    // ----------------------------------

    const existingEvaluation =
      await Evaluation.findOne({
        interviewId,
        userId: req.user._id,
      });

    if (existingEvaluation) {
      return res.status(200).json(
        new ApiResponse(
          200,
          existingEvaluation,
          "Interview already evaluated"
        )
      );
    }

    // ----------------------------------
    // 3. Get questions
    // ----------------------------------

    const questions = await Question.find({
      interviewId: interview._id,
    }).sort({
      createdAt: 1,
    });

    if (!questions.length) {
      throw new ApiError(
        400,
        "No questions found for this interview"
      );
    }

    // ----------------------------------
    // 4. Mark as evaluating
    // ----------------------------------

    interview.status = "evaluating";

    await interview.save();

    // ----------------------------------
    // 5. Add evaluation job to BullMQ
    // ----------------------------------

    const job = await evaluationQueue.add(
      "evaluate-interview",
      {
        interviewId: interview._id.toString(),
        userId: req.user._id.toString(),
      },
      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,

        removeOnFail: false,
      }
    );

    console.log(
      "========== EVALUATION JOB QUEUED =========="
    );

    console.log("Job ID:", job.id);
    console.log(
      "Interview ID:",
      interview._id.toString()
    );

    // ----------------------------------
    // 6. Send immediate response
    // ----------------------------------

    return res.status(202).json(
      new ApiResponse(
        202,
        {
          jobId: job.id,

          interviewId:
            interview._id,

          status: "evaluating",
        },
        "Interview evaluation started"
      )
    );
  }
);

const getInterviewEvaluationController = asyncHandler(
  async (req, res) => {
    const { interviewId } = req.params;

    const evaluation = await Evaluation.findOne({
      interviewId,
      userId: req.user._id,
    }).populate(
      "questions.questionId"
    );

    if (!evaluation) {
      throw new ApiError(
        404,
        "Interview evaluation not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        evaluation,
        "Interview evaluation fetched successfully"
      )
    );
  }
);

const getInterviewHistory = asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find({
    userId: req.user._id,
  })
    .populate({
      path: "interviewId",
      select:
        "role company difficulty questionCount codingQuestionCount oralQuestionCount status createdAt",
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      evaluations,
      "Interview history fetched successfully"
    )
  );
});



export {
  generateInterview,
  getInterview,
  submitAnswer,
  getActiveInterview,
  evaluateInterviewController,
  getInterviewEvaluationController,
  getInterviewHistory
};