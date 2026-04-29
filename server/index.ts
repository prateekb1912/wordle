import express from "express";
import http from "http";
import { Server } from "socket.io";
import { WORDS } from "../src/words";

const MAX_GUESSES = 6;
const MAX_ROUNDS = 1;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", ({ playerName }) => {
    const roomCode = Math.random().toString(36).substring(2, 7).toLowerCase();
    const socketId = socket.id;

    rooms[roomCode] = {
      code: roomCode,
      host: socketId,
      players: [{ id: socketId, name: playerName, score: 0 }],
      status: "lobby",
      currentRound: 0,
      roundState: null,
      scores: { [socketId]: 0 },
    };

    socket.join(roomCode);
    socket.emit("roomUpdated", rooms[roomCode]);
  });

  socket.on("joinRoom", ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    const socketId = socket.id;

    if (!room) return socket.emit("error", "Room not found");

    room.players.push({ id: socket.id, name: playerName, score: 0 });
    room.scores[socketId] = 0;
    socket.join(roomCode);
    io.to(roomCode).emit("roomUpdated", room);
  });

  socket.on("startGame", ({ roomCode }) => {
    const room = rooms[roomCode];

    console.log(`Round: ${room.currentRound}`);

    if (room.currentRound >= MAX_ROUNDS) {
      room.status = "gameEnd";
      const leaderboard = room.players.map((p) => ({
        name: p.name,
        score: room.scores[p.id] || 0,
      }));
      leaderboard.sort((a, b) => b.score - a.score);
      io.to(roomCode).emit("gameOver", {
        leaderboard,
      });
      return;
    }

    const word = (
      WORDS[Math.floor(Math.random() * WORDS.length)] as string
    ).toUpperCase();

    room.status = "playing";
    room.currentRound++;
    room.roundState = { word, startTime: Date.now(), playerProgress: {} };
    io.to(roomCode).emit("roundStarted", { word, round: room.currentRound });
  });

  socket.on("submitResult", ({ roomCode, guessCount, won }) => {
    const room = rooms[roomCode];
    const socketId = socket.id;
    const points = won ? (MAX_GUESSES - guessCount + 1) * 100 : 0;

    room.roundState.playerProgress[socket.id] = {
      guessCount,
      won,
      finishTime: Date.now(),
      points,
    };
    room.scores[socketId] = (room.scores[socketId] || 0) + points;

    const allDone = room.players.every(
      (player) => room.roundState.playerProgress[player.id],
    );
    const leaderboard = room.players.map((player) => ({
      name: player.name,
      score: room.scores[player.id] || 0,
    }));
    leaderboard.sort((a, b) => b.score - a.score);
    io.to(roomCode).emit("leaderboardUpdated", leaderboard);

    if (allDone) {
      console.log("ALL PLAYERS DONE");
      room.status = "round_end";
      io.to(roomCode).emit("roundEnded", {
        word: room.roundState.word,
        leaderboard,
      });
    }
  });

  socket.on("resetRoom", ({ roomCode }) => {
    const room = rooms[roomCode];

    room.status = "lobby";
    room.currentRound = 0;
    room.scores = {};
    room.players.forEach((p) => (p.score = 0));

    io.to(roomCode).emit("roomUpdated", room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
