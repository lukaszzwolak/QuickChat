const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//serwowanie statycznych plikow z folderu clienta
app.use(express.static(path.join(__dirname, "client")));

//obsluga WebSocket
wss.on("connection", (ws) => {
  console.log("New client connection");

  ws.on("message", (message) => {
    const parsed = JSON.parse(message);
    console.log("Received:", parsed);

    //emicsja wiadomości do wszystkich klientów
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

//start serwera
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
