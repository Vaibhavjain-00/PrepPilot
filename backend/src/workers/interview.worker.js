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

    console.log("\n");
    console.log(
      "=================================================="
    );
    console.log(
      "========== INTERVIEW GENERATION JOB STARTED =========="
    );
    console.log(
      "=================================================="
    );

    console.log("Job ID:", job.id);
    console.log("Interview ID:", interviewId);
    console.log("User ID:", userId);
    console.log("Resume ID:", resumeId);
    console.log("Role:", role);
    console.log("Company:", company);
    console.log("Difficulty:", difficulty);
    console.log("Question Count:", questionCount);
    console.log("Language:", language);

    try {
      // ==================================================
      // 1. FIND INTERVIEW
      // ==================================================

      console.log("\n========== STEP 1: FINDING INTERVIEW ==========");

      const interview = await Interview.findOne({
        _id: interviewId,
        userId,
      });

      if (!interview) {
        console.error(
          "❌ INTERVIEW NOT FOUND"
        );

        throw new Error("Interview not found");
      }

      console.log(
        "✅ Interview found"
      );

      console.log(
        "Current Interview Status:",
        interview.status
      );

      console.log(
        "Existing Question IDs:",
        interview.questions?.length || 0
      );

      // ==================================================
      // 2. DUPLICATE GENERATION CHECK
      // ==================================================

      console.log(
        "\n========== STEP 2: CHECKING DUPLICATE GENERATION =========="
      );

      if (
        interview.status === "ready" &&
        interview.questions?.length
      ) {
        console.log(
          "⚠️ Interview already generated"
        );

        console.log(
          "Existing Questions:",
          interview.questions.length
        );

        return {
          success: true,
          alreadyGenerated: true,
          interviewId,
        };
      }

      console.log(
        "✅ No existing completed generation found"
      );

      // ==================================================
      // 3. FIND RESUME
      // ==================================================

      console.log(
        "\n========== STEP 3: FINDING RESUME =========="
      );

      console.log(
        "Searching Resume with:",
        {
          resumeId,
          userId,
        }
      );

      const resume = await Resume.findOne({
        _id: resumeId,
        userId,
      });

      if (!resume) {
        console.error(
          "❌ RESUME NOT FOUND"
        );

        throw new Error("Resume not found");
      }

      console.log(
        "✅ Resume found"
      );

      console.log(
        "Resume ID:",
        resume._id.toString()
      );

      // ==================================================
      // 4. MARK INTERVIEW AS GENERATING
      // ==================================================

      console.log(
        "\n========== STEP 4: MARKING INTERVIEW GENERATING =========="
      );

      interview.status = "generating";

      await interview.save();

      console.log(
        "✅ Interview marked as generating"
      );

      // ==================================================
      // 5. AI GENERATION
      // ==================================================

      console.log(
        "\n========== STEP 5: AI INTERVIEW GENERATION STARTED =========="
      );

      console.log(
        "Sending data to Gemini..."
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

      // ==================================================
      // 6. LOG AI RESULT
      // ==================================================

      console.log(
        "\n========== STEP 6: VALIDATING AI RESULT =========="
      );

      console.log(
        "AI Result exists:",
        !!aiResult
      );

      console.log(
        "AI Questions Array:",
        Array.isArray(aiResult?.questions)
      );

      console.log(
        "AI Questions Count:",
        aiResult?.questions?.length
      );

      console.log(
        "AI Distribution:",
        aiResult?.distribution
      );

      console.log(
        "FULL AI RESULT:"
      );

      console.log(
        JSON.stringify(
          aiResult,
          null,
          2
        )
      );

      // ==================================================
      // 7. VALIDATE AI RESPONSE
      // ==================================================

      if (
        !aiResult ||
        !Array.isArray(aiResult.questions) ||
        !aiResult.distribution
      ) {
        console.error(
          "❌ INVALID AI RESPONSE"
        );

        throw new Error(
          "Invalid AI interview generation response"
        );
      }

      console.log(
        "✅ AI response structure valid"
      );

      if (
        aiResult.questions.length !==
        questionCount
      ) {
        console.error(
          "❌ QUESTION COUNT MISMATCH"
        );

        console.error(
          "Expected:",
          questionCount
        );

        console.error(
          "Received:",
          aiResult.questions.length
        );

        throw new Error(
          "AI did not generate the required number of questions"
        );
      }

      console.log(
        "✅ Correct number of questions generated"
      );

      // ==================================================
      // 8. UPDATE DISTRIBUTION
      // ==================================================

      console.log(
        "\n========== STEP 7: UPDATING QUESTION DISTRIBUTION =========="
      );

      console.log(
        "Coding Questions:",
        aiResult.distribution.coding
      );

      console.log(
        "Oral Questions:",
        aiResult.distribution.oral
      );

      interview.codingQuestionCount =
        aiResult.distribution.coding;

      interview.oralQuestionCount =
        aiResult.distribution.oral;

      console.log(
        "✅ Question distribution updated"
      );

      // ==================================================
      // 9. PREPARE QUESTION DOCUMENTS
      // ==================================================

      console.log(
        "\n========== STEP 8: PREPARING QUESTION DOCUMENTS =========="
      );

      const questionDocuments =
        aiResult.questions.map(
          (item, index) => {

            console.log(
              `Preparing Question ${index + 1}`
            );

            console.log(
              "Category:",
              item.category
            );

            console.log(
              "Question:",
              item.question
            );

            console.log(
              "Expected Answer Exists:",
              !!item.expectedAnswer
            );

            return {
              interviewId:
                interview._id,

              question:
                item.question?.trim() || "",

              expectedAnswer:
                item.expectedAnswer?.trim() || "",

              category:
                item.category,

              candidateAnswer: "",

              score: null,
            };
          }
        );

      console.log(
        "Question documents created:",
        questionDocuments.length
      );

      // ==================================================
      // 10. VALIDATE QUESTION DOCUMENTS
      // ==================================================

      console.log(
        "\n========== STEP 9: VALIDATING QUESTION DOCUMENTS =========="
      );

      questionDocuments.forEach(
        (question, index) => {

          console.log(
            `Question ${index + 1}:`,
            {
              interviewId:
                question.interviewId?.toString(),

              category:
                question.category,

              hasQuestion:
                !!question.question,

              hasExpectedAnswer:
                !!question.expectedAnswer,
            }
          );
        }
      );

      // ==================================================
      // 11. INSERT QUESTIONS
      // ==================================================

      console.log(
        "\n========== STEP 10: SAVING QUESTIONS TO MONGODB =========="
      );

      console.log(
        "Calling Question.insertMany()..."
      );

      let createdQuestions;

      try {

        createdQuestions =
          await Question.insertMany(
            questionDocuments
          );

        console.log(
          "========== QUESTIONS SAVED SUCCESSFULLY =========="
        );

        console.log(
          "Saved Questions Count:",
          createdQuestions.length
        );

        console.log(
          "Saved Question IDs:"
        );

        console.log(
          createdQuestions.map(
            (question) =>
              question._id.toString()
          )
        );

      } catch (error) {

        console.error(
          "\n========== QUESTION INSERT FAILED =========="
        );

        console.error(
          "Error Name:",
          error.name
        );

        console.error(
          "Error Message:",
          error.message
        );

        console.error(
          "Error:",
          error
        );

        if (error.errors) {
          console.error(
            "Mongoose Validation Errors:",
            error.errors
          );
        }

        throw error;
      }

      // ==================================================
      // 12. VERIFY QUESTIONS
      // ==================================================

      console.log(
        "\n========== STEP 11: VERIFYING SAVED QUESTIONS =========="
      );

      const savedQuestions =
        await Question.find({
          interviewId:
            interview._id,
        });

      console.log(
        "Questions found in MongoDB:",
        savedQuestions.length
      );

      if (
        savedQuestions.length !==
        questionCount
      ) {
        console.error(
          "❌ QUESTION COUNT AFTER SAVE DOES NOT MATCH"
        );

        console.error(
          "Expected:",
          questionCount
        );

        console.error(
          "Found:",
          savedQuestions.length
        );

        throw new Error(
          "Questions were not saved correctly"
        );
      }

      console.log(
        "✅ All questions verified in MongoDB"
      );

      // ==================================================
      // 13. STORE QUESTION IDS IN INTERVIEW
      // ==================================================

      console.log(
        "\n========== STEP 12: STORING QUESTION IDS =========="
      );

      interview.questions =
        createdQuestions.map(
          (question) =>
            question._id
        );

      console.log(
        "Question IDs assigned:",
        interview.questions.length
      );

      // ==================================================
      // 14. MARK INTERVIEW READY
      // ==================================================

      console.log(
        "\n========== STEP 13: MARKING INTERVIEW READY =========="
      );

      interview.status = "ready";

      await interview.save();

      console.log(
        "✅ Interview saved successfully"
      );

      console.log(
        "Final Interview Status:",
        interview.status
      );

      console.log(
        "Final Question Count:",
        interview.questions.length
      );

      // ==================================================
      // 15. FINAL VERIFICATION
      // ==================================================

      console.log(
        "\n========== STEP 14: FINAL VERIFICATION =========="
      );

      const finalInterview =
        await Interview.findOne({
          _id: interviewId,
          userId,
        });

      console.log(
        "Final Interview Exists:",
        !!finalInterview
      );

      console.log(
        "Final Status:",
        finalInterview?.status
      );

      console.log(
        "Final Question IDs:",
        finalInterview?.questions?.length
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      console.log(
        "\n=================================================="
      );

      console.log(
        "========== INTERVIEW GENERATION SUCCESS =========="
      );

      console.log(
        "=================================================="
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
        "\n=================================================="
      );

      console.error(
        "========== INTERVIEW GENERATION FAILED =========="
      );

      console.error(
        "=================================================="
      );

      console.error(
        "Job ID:",
        job.id
      );

      console.error(
        "Interview ID:",
        interviewId
      );

      console.error(
        "Error Name:",
        error.name
      );

      console.error(
        "Error Message:",
        error.message
      );

      console.error(
        "FULL ERROR:",
        error
      );

      // ==================================================
      // RESET INTERVIEW STATUS
      // ==================================================

      console.log(
        "\n========== RESETTING INTERVIEW STATUS =========="
      );

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

        console.log(
          "Interview status changed to FAILED"
        );

      } catch (updateError) {

        console.error(
          "❌ FAILED TO UPDATE INTERVIEW STATUS"
        );

        console.error(
          "Update Error:",
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

// ==================================================
// WORKER EVENTS
// ==================================================

interviewWorker.on(
  "completed",
  (job, result) => {

    console.log(
      "\n========== INTERVIEW WORKER COMPLETED =========="
    );

    console.log(
      "Job ID:",
      job.id
    );

    console.log(
      "Result:",
      result
    );
  }
);

interviewWorker.on(
  "failed",
  (job, error) => {

    console.error(
      "\n========== INTERVIEW WORKER FAILED EVENT =========="
    );

    console.error(
      "Job ID:",
      job?.id
    );

    console.error(
      "Error Name:",
      error?.name
    );

    console.error(
      "Error Message:",
      error?.message
    );

    console.error(
      "Error:",
      error
    );
  }
);

console.log(
  "========== INTERVIEW GENERATION WORKER READY =========="
);

export default interviewWorker;