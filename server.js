const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = [];

// Serwowanie statycznych plików z folderu client
app.use(express.static(path.join(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Obsługa WebSocket
wss.on("connection", (ws) => {
  console.log("New client connection");

  ws.on("message", (message) => {
    const parsed = JSON.parse(message);
    console.log("Received:", parsed);

    // Emisja wiadomości do wszystkich klientów
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsed));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start serwera
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
