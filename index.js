const express = require('express');
const socket = require('socket.io');

const { Game } = require('./Game');
const { Chat } = require('./Chat');

const app = express();
const server = app.listen(4000, () => {
  console.log();
  console.log('=======================');
  console.log('listening on port 4000,');
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  const game = new Game({ io: io, socket: socket });
  const chat = new Chat({ io: io, socket: socket });
  chat.connectPlayer({ game: game });
});
