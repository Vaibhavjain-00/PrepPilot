import { Worker } from "bullmq";

import redis from "../config/redis.js";

import {Interview} from "../models/interview.js";
import {Question} from "../models/question.js";
import {Evaluation} from "../models/evaluation.js";

import { evaluateInterview } from "../services/aiEvaluation.service.js";

const evaluationWorker = new Worker(
  "evaluation",
  async (job) => {
    const { interviewId, userId } = job.data;


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
      // 2. Prevent duplicate evaluation
      // ----------------------------------

      const existingEvaluation =
        await Evaluation.findOne({
          interviewId,
          userId,
        });

      if (existingEvaluation) {

        return {
          success: true,
          alreadyEvaluated: true,
        };
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
        throw new Error(
          "No questions found for this interview"
        );
      }

      // ----------------------------------
      // 4. Mark as evaluating
      // ----------------------------------

      interview.status = "evaluating";

      await interview.save();

      // ----------------------------------
      // 5. AI Evaluation
      // ----------------------------------

      const evaluation =
        await evaluateInterview({
          interview,
          questions,
        });

      // ----------------------------------
      // 6. Validate AI response
      // ----------------------------------

      if (
        !evaluation ||
        !Array.isArray(
          evaluation.evaluatedQuestions
        )
      ) {
        interview.status = "in-progress";

        await interview.save();

        throw new Error(
          "Invalid AI evaluation response"
        );
      }

      if (
        evaluation.evaluatedQuestions.length !==
        questions.length
      ) {
        interview.status = "in-progress";

        await interview.save();

        throw new Error(
          "AI did not evaluate all questions"
        );
      }

      // ----------------------------------
      // 7. Map AI evaluation
      // ----------------------------------

      const evaluationQuestions =
        evaluation.evaluatedQuestions
          .map((item) => {
            const index =
              Number(item.questionNumber) - 1;

            const question =
              questions[index];

            if (!question) {
              return null;
            }

            let score = Number(item.score);

            // Safety
            if (Number.isNaN(score)) {
              score = 0;
            }

            if (score < 0) {
              score = 0;
            }

            if (score > 10) {
              score = 10;
            }

            return {
              questionId: question._id,

              question: question.question,

              category: question.category,

              candidateAnswer:
                question.candidateAnswer || "",

              score,

              feedback:
                item.feedback || "",
            };
          })
          .filter(Boolean);

      // ----------------------------------
      // 8. Make sure all questions mapped
      // ----------------------------------

      if (
        evaluationQuestions.length !==
        questions.length
      ) {
        interview.status = "in-progress";

        await interview.save();

        throw new Error(
          "Failed to map AI evaluation to questions"
        );
      }

      // ----------------------------------
      // 9. Calculate overall score
      // ----------------------------------

      const totalScore =
        evaluationQuestions.reduce(
          (sum, item) =>
            sum + item.score,
          0
        );

      const maxScore =
        questions.length * 10;

      const overallScore = Math.round(
        (totalScore / maxScore) * 100
      );

      // ----------------------------------
      // 10. Create Evaluation document
      // ----------------------------------

      const evaluationDocument =
        await Evaluation.create({
          userId,

          interviewId: interview._id,

          overallScore,

          overallFeedback:
            evaluation.overallFeedback || "",

          questions: evaluationQuestions,
        });

      // ----------------------------------
      // 11. Update individual question scores
      // ----------------------------------

      for (
        const evaluatedQuestion
        of evaluationQuestions
      ) {
        await Question.findByIdAndUpdate(
          evaluatedQuestion.questionId,
          {
            score:
              evaluatedQuestion.score,
          }
        );
      }

      // ----------------------------------
      // 12. Mark interview completed
      // ----------------------------------

      interview.status = "completed";

      interview.score = overallScore;

      interview.feedback =
        evaluation.overallFeedback || "";

      await interview.save();

      return {
        success: true,
        evaluationId:
          evaluationDocument._id.toString(),
        overallScore,
      };

    } catch (error) {

      console.error(error);

      // Try to reset interview status
      try {
        await Interview.findOneAndUpdate(
          {
            _id: interviewId,
            userId,
          },
          {
            status: "in-progress",
          }
        );
      } catch (updateError) {
        console.error(
          "Failed to reset interview status:",
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

evaluationWorker.on(
  "completed",
  (job, result) => {
    console.log(
      `Evaluation job ${job.id} completed`,
      result
    );
  }
);

evaluationWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `Evaluation job ${job?.id} failed`
    );

    console.error(error);
  }
);

export default evaluationWorker;