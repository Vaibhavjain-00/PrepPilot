const setupInterviewSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("interview:join", ({ interviewId }) => {
      if (!interviewId) {
        return;
      }

      const room = `interview:${interviewId}`;

      socket.join(room);

      console.log(`Socket ${socket.id} joined ${room}`);

      socket.emit("interview:joined", {
        interviewId,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });
};

export { setupInterviewSocket };
