const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(express.json());

// Correct path to Frontend folder (sibling to Backend)
app.use(express.static(path.join(__dirname, "../Frontend"))); // <-- changed here

const server = http.createServer(app);
const io = new Server(server);

// Endpoint for ESP32 to send scanned UID
app.post("/scan", (req, res) => {
    const tag = req.body.tag;
    console.log("RFID Tag received:", tag);

    // Emit UID to all connected frontend clients
    io.emit("rfid-scan", { tag });

    // Send success response to ESP32
    res.sendStatus(200);
});

// Handle frontend socket connections
io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Frontend disconnected:", socket.id);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
