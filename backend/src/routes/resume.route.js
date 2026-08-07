import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadResume,
  getResume,
  deleteResume,
  updateResume,
} from "../controllers/resume.controller.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

router.get("/", getResume);

router.delete("/", deleteResume);
router.patch("/", updateResume);

export default router;