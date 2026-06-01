const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http')
const cors = require('cors');
const jsonWebToken = require('jsonwebtoken');

const app = express();

const routes = require('./src/route/routes');
const connectDb = require('./src/dbconnection/db');

const { Server, Socket } = require("socket.io")

const server = http.createServer(app)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://music-app-topaz-eta.vercel.app"
    ],
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://music-app-topaz-eta.vercel.app"
    ],
    credentials: true,
  }
})
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User Connected : ", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected");

  })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

connectDb();

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});