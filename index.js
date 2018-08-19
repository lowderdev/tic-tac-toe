const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(4000, () => {
  console.log();
  console.log('=======================');
  console.log('listening on port 4000,');
});

app.use(express.static('public'));

const io = socket(server);

let playerNum = 1;
let players = {};

io.on('connection', (socket) => {
  connectPlayer(socket);

  socket.on('typing', (data) => {
    console.log(data);
    let handle = getHandle(data.id)
    socket.broadcast.emit('typing', { handle: handle, typing: data.typing });
  });

  socket.on('chat', (data) => {
    let handle = getHandle(data.id)
    io.emit('chat', { handle: handle, message: data.message });
  });

  socket.on('move', (data) => {
    console.log('move');
    console.log(`Making move on ${data}`);
    io.emit('move', data);
  });

  socket.on('disconnect', () => {
    let handle = getHandle(socket.id)
    io.emit('chat', { handle: 'Server', message: `${handle} disconnected.` });
  });
});

function getHandle(id) {
  return `Player${players[String(id)].playerNum}`
}

function connectPlayer(socket) {
  console.log(`connecting player${playerNum}: ${socket.id}`);
  players[String(socket.id)] = { playerNum: playerNum };
  socket.emit('connected', { id: socket.id, playerNum: playerNum });
  socket.broadcast.emit('chat', { handle: 'Server', message: `Player${playerNum} connected.` });
  playerNum++;
}
