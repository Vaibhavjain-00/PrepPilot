import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://prep-pilot-eosin-pi.vercel.app",
    credentials: true,
  }),
);
import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.route.js";
import interviewRoutes from "./routes/interview.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/interviews", interviewRoutes);
app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use(errorHandler);
export default app;
