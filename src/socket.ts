import { createServer } from "node:http";
import { Server } from "socket.io";

const wsServer = createServer();

const io = new Server(wsServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("join", (data) => {
    socket.join(data.tenantId);

    socket.emit("join", {
      roomId: data.tenantId,
    });
  });
});

export { wsServer, io };
