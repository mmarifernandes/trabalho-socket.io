const express = require("express");
const app = express();

// ATENCAO
const http = require("http");
const server = http.createServer(app);

const users = [];
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/meu.html");
});

io.on("connection", (socket) => {
  socket.client.nick = socket.client.id;
  console.log("a user connected");

  users.push(socket.client.nick);
  io.emit("nome usuarios", users);
  io.emit("chat message", socket.client.nick + " se conectou");

  console.log(users);

  socket.on("chat message", (msg) => {
    console.log("sid: " + socket.client.id + "\tmessage: " + msg);
    io.emit("chat message", socket.client.nick + " disse: " + msg);
  });

  socket.on("set nick", (msg) => {
    const oldNick = socket.client.nick;
    let posicao = users.indexOf(oldNick);

    io.emit("chat message", `${oldNick} trocou seu nome para ${msg}`);
    console.log(posicao);
    socket.client.nick = msg;
    users[posicao] = socket.client.nick;
    io.emit("nome usuarios", users);
    console.log(users);
  });

  socket.on("disconnect", () => {
    let posicao = users.indexOf(socket.client.nick);
      io.emit("chat message", socket.client.nick + " se desconectou");

    users.splice(posicao, 1);
    console.log("user disconnected");
    console.log(posicao);
    console.log(users);
    io.emit("nome usuarios", users);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
