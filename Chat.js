let playerNum = 1;
let players = {};

exports.Chat = class Chat {
  constructor (args) {
    this.io = args.io;
    this.socket = args.socket;

    this.socket.on('typing', (data) => {
      const handle = this.getHandle(data.id);
      this.socket.broadcast.emit('typing', { handle: handle, typing: data.typing });
    });

    this.socket.on('chat', (data) => {
      const handle = this.getHandle(data.id);
      this.io.emit('chat', { handle: handle, message: data.message });
    });

    this.socket.on('disconnect', () => {
      const handle = this.getHandle(this.socket.id);
      this.io.emit('chat', { handle: 'Server', message: `${handle} disconnected.` });
    });
  }

  getHandle (id) {
    return `Player${players[String(id)].playerNum}`;
  }

  connectPlayer (args) {
    const game = args.game;
    const playerId = String(this.socket.id);
    console.log(`connecting player${playerNum}: ${playerId}`);

    players[playerId] = { playerNum: playerNum };
    this.socket.emit('connected', { id: playerId, playerNum: playerNum });
    this.io.emit('chat', { handle: 'Server', message: `Player${playerNum} connected.` });
    playerNum++;
    game.addPlayerToGame(this.socket);
  }
}
