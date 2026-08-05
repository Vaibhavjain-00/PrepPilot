import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);


app.use(errorHandler);
export default app;