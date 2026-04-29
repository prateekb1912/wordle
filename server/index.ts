import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", ({ playerName }) => {
    const roomCode = Math.random().toString(36).substring(2, 7).toLowerCase();

    console.log(playerName);
    console.log(roomCode);

    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: [{ id: socket.id, name: playerName }],
    };

    socket.join(roomCode);
    socket.emit("roomUpdated", rooms[roomCode]);
  });

  socket.on("joinRoom", ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    console.log(JSON.stringify(rooms));
    console.log(playerName);
    if (!room) return socket.emit("error", "Room not found");

    room.players.push({ id: socket.id, name: playerName });
    socket.join(roomCode);
    io.to(roomCode).emit("roomUpdated", room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
