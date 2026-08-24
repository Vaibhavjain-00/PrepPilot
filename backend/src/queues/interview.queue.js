import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const interviewQueue = new Queue("interview-generation", {
  connection: redis,
});

interviewQueue.on("error", (error) => {
  console.error(
    "========== INTERVIEW QUEUE ERROR =========="
  );

  console.error(error);
});