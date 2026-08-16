import { Router } from "express";

import {
  evaluateInterviewController,
  generateInterview,
  getActiveInterview,
  getInterview,
  getInterviewEvaluationController,
  getInterviewHistory,
  submitAnswer,
} from "../controllers/interview.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Generate Interview
|--------------------------------------------------------------------------
*/

router.post("/generate", verifyJWT, generateInterview);

/*
|--------------------------------------------------------------------------
| Get Interview
|--------------------------------------------------------------------------
*/
router.get("/active", verifyJWT, getActiveInterview);



router.get(
  "/history",
  verifyJWT,
  getInterviewHistory
);
router.get("/:interviewId", verifyJWT, getInterview);
router.post(
  "/:interviewId/questions/:questionId/answer",
  verifyJWT,
  submitAnswer,
);

router.post(
  "/:interviewId/evaluate",
  verifyJWT,
  evaluateInterviewController
);

router.get(
  "/:interviewId/evaluation",
  verifyJWT,
  getInterviewEvaluationController
);



export default router;
