import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const evaluationQueue = new Queue("evaluation", {
  connection: redis,
});

evaluationQueue.on("error", (error) => {
  console.error("========== EVALUATION QUEUE ERROR ==========");
  console.error(error);
});