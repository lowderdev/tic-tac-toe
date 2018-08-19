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
  console.log(`connecting player ${playerNum}`, socket.id);
  players[socket.id] = playerNum
  socket.emit('connected', { id: socket.id, playerNum: playerNum });
  socket.broadcast.emit('chat', { handle: 'Server', message: `Player${playerNum} connected.` });
  playerNum++;

  socket.on('chat', (data) => {
    console.log(data);
    io.emit(
      'chat',
      { handle: `Player${players[data.id]}`, message: data.message }
    );
  });

  socket.on('typing', (data) => {
    console.log(data);
    socket.broadcast.emit('typing', data);
  });

  socket.on('move', (data) => {
    console.log('move');
    console.log(`Making move on ${data}`);
    io.emit('move', data);
  });

  socket.on('disconnect', () => {
    const departingPlayerNum = players[socket.id];
    io.emit('chat', { handle: 'Server', message: `Player${departingPlayerNum} disconnected.` });
  });
});
