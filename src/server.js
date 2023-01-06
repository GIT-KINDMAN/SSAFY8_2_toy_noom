import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import path, { parse } from "path";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // 이렇게 하면 http wss 둘다 가능

const sockets = [];

wss.on("connection", (socket) => {
  // connection이 생기면 socket을 받는다는걸 알 수 있다
  sockets.push(socket); // 연결이 될 때 sockets에 socket을 넣어줄 것이다
  console.log("Connected to Browser!");
  socket.on("close", () => console.log("Disconnected from the browser"));
  socket.on("message", (message) => {
    const parsed = JSON.parse(message);
    switch (parsed.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(parsed.payload));
      case "nickname":
        console.log(parsed.payload);
    }
  });
});

server.listen(3000, handleListen);
