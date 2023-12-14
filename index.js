const express = require("express");
const app = express();
const http = require("http");

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log('a user connected');

    io.emit("connection", "a new user connected"); // sends an event to ALL registered clients (sockets)
    socket.emit("welcome", "welcome new user"); // sends an event to ONLY the client who sent the server an event
    //socket.broadcast.emit("new user", "a new chat user has arrived"); // sends an event to all clients EXCEPT the one who sent the server an event

    // when a client chooses a name and enters the chat, log it and resend out to all clients
    socket.on('new user', (name) => {
        console.log(name);
        socket.broadcast.emit('new user', name.name + ' has entered the chat');
        socket.emit('new user', 'Welcome, ' + name.name + '!')
    }); 

    // when a client sends a chat message, log it and resend out to all clients
    socket.on('chat message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('chat message', {message: msg.name + ": " + msg.msg, color: msg.color});
    });    

    // when a client disconnects, log it and send out an event to all other clients
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user left', "a user has left the chat");
    });    
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
