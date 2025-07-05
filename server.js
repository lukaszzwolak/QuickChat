const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();
const PORT = 3000;

// Serwowanie statycznych plików z folderu client
app.use(express.static(path.join(__dirname, "client")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Start serwera + inicjalizacja Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const io = socket(server);

// Tablica wiadomości
const messages = [];

// Obsługa połączeń WebSocket przez Socket.IO
io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);

  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");
  });

  console.log("I've added a listener on message and disconnect events\n");
});
