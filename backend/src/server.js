// import dotenv from "dotenv/config";
// import connectDB from "./db/index.js";
// import app from "./app.js";



// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

import dotenv from "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import "./config/redis.js";
import "./workers/evaluation.woker.js";
import "./workers/interview.worker.js"

import connectDB from "./db/index.js";
import app from "./app.js";
import { setupInterviewSocket } from "./socket/interview.socket.js";

const PORT = process.env.PORT || 8000;

// Create HTTP server using Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin:"https://prep-pilot-eosin-pi.vercel.app",
    credentials: true,
  },
});

// Setup Socket.IO events
setupInterviewSocket(io);

// Connect database and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
