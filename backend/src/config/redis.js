import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("========== REDIS CONNECTED ==========");
});

redis.on("error", (error) => {
  console.error("========== REDIS ERROR ==========");
  console.error(error);
});

export default redis;