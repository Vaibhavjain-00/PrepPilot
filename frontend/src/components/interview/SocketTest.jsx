import { useEffect } from "react";
import socket from "../../services/socket.js";

function SocketTest() {

  console.log("SocketTest component rendered");

  useEffect(() => {

    console.log("Connecting socket...");

    socket.connect();

    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("SOCKET ERROR:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("DISCONNECTED:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");

      socket.disconnect();
    };

  }, []);

  return (
    <div>
      Socket Test
    </div>
  );
}

export default SocketTest;