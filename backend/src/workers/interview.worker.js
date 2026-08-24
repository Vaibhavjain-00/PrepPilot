import { Worker } from "bullmq";

import redis from "../config/redis.js";

import { Interview } from "../models/interview.js";
import { Question } from "../models/question.js";

import { Resume } from "../models/resume.js";

import { generateInterviewQuestions } from "../services/aiInterview.service.js";

const interviewWorker = new Worker(
  "interview-generation",

  async (job) => {
    const {
      interviewId,
      userId,
      resumeId,
      role,
      company,
      difficulty,
      questionCount,
      language,
    } = job.data;

    console.log(
      "========== INTERVIEW GENERATION JOB STARTED =========="
    );

    console.log("Interview ID:", interviewId);

    try {
      // ----------------------------------
      // 1. Find interview
      // ----------------------------------

      const interview = await Interview.findOne({
        _id: interviewId,
        userId,
      });

      if (!interview) {
        throw new Error("Interview not found");
      }

      // ----------------------------------
      // 2. Prevent duplicate generation
      // ----------------------------------

      if (
        interview.status === "ready" &&
        interview.questions?.length
      ) {
        console.log(
          "Interview already generated"
        );

        return {
          success: true,
          alreadyGenerated: true,
          interviewId,
        };
      }

      // ----------------------------------
      // 3. Get resume
      // ----------------------------------

      const resume = await Resume.findOne({
        _id: resumeId,
        userId,
      });

      if (!resume) {
        throw new Error("Resume not found");
      }

      // ----------------------------------
      // 4. Mark as generating
      // ----------------------------------

      interview.status = "generating";

      await interview.save();

      // ----------------------------------
      // 5. Generate questions using AI
      // ----------------------------------

      console.log(
        "========== AI INTERVIEW GENERATION STARTED =========="
      );

      const aiResult =
        await generateInterviewQuestions({
          resume,

          role,

          company,

          difficulty,

          questionCount,

          language,
        });

      console.log(
        "========== AI INTERVIEW GENERATION COMPLETED =========="
      );

      console.log("AI RESULT:", JSON.stringify(aiResult, null, 2));

      // ----------------------------------
      // 6. Validate AI response
      // ----------------------------------

      if (
        !aiResult ||
        !Array.isArray(aiResult.questions) ||
        !aiResult.distribution
      ) {
        throw new Error(
          "Invalid AI interview generation response"
        );
      }

      if (
        aiResult.questions.length !==
        questionCount
      ) {
        throw new Error(
          "AI did not generate the required number of questions"
        );
      }

      // ----------------------------------
      // 7. Update question distribution
      // ----------------------------------

      interview.codingQuestionCount =
        aiResult.distribution.coding;

      interview.oralQuestionCount =
        aiResult.distribution.oral;

      // ----------------------------------
      // 8. Create Questions
      // ----------------------------------

      const questionDocuments =
        aiResult.questions.map((item) => ({
          interviewId: interview._id,

          question:
            item.question?.trim() || "",

          expectedAnswer:
            item.expectedAnswer?.trim() || "",

          category: item.category,

          candidateAnswer: "",

          score: null,
        }));

      const createdQuestions =
        await Question.insertMany(
          questionDocuments
        );

      // ----------------------------------
      // 9. Store question IDs
      // ----------------------------------

      interview.questions =
        createdQuestions.map(
          (question) => question._id
        );

      // ----------------------------------
      // 10. Mark interview ready
      // ----------------------------------

      interview.status = "ready";

      await interview.save();

      console.log(
        "========== INTERVIEW GENERATION SUCCESS =========="
      );

      return {
        success: true,

        interviewId:
          interview._id.toString(),

        questionCount:
          createdQuestions.length,

        codingQuestionCount:
          interview.codingQuestionCount,

        oralQuestionCount:
          interview.oralQuestionCount,
      };

    } catch (error) {

      console.error(
        "========== INTERVIEW GENERATION FAILED =========="
      );

      console.error(error);

      // ----------------------------------
      // Reset status
      // ----------------------------------

      try {
        await Interview.findOneAndUpdate(
          {
            _id: interviewId,
            userId,
          },
          {
            status: "failed",
          }
        );
      } catch (updateError) {
        console.error(
          "Failed to update interview status:",
          updateError
        );
      }

      throw error;
    }
  },

  {
    connection: redis,

    concurrency: 2,
  }
);

interviewWorker.on(
  "completed",
  (job, result) => {
    console.log(
      `Interview generation job ${job.id} completed`,
      result
    );
  }
);

interviewWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `Interview generation job ${job?.id} failed`
    );

    console.error(error);
  }
);

console.log(
  "========== INTERVIEW GENERATION WORKER READY =========="
);

export default interviewWorker;