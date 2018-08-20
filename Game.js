let activePlayers = { 'X': null, 'O': null };
let activePlayer = '';

exports.Game = class Game {
  constructor (args) {
    const io = args.io;
    const socket = args.socket;

    socket.on('move', (data) => {
      const mark = this.getKeyByValue(activePlayers, data.id);

      if (activePlayer != mark) return;
      console.log(`${data.id} marking ${mark} on ${data.squareId}`);

      io.emit('move', { squareId: data.squareId, mark: mark });
      this.nextTurn(mark);
    });
  }

  addPlayerToGame (socket) {
    const playerId = socket.id;

    if (activePlayers['X'] === null) {
      activePlayers['X'] = playerId;
      activePlayer = 'X';
      console.log('activePlayers x: ', activePlayers);
      socket.emit('joinedGame', { mark: 'X' });
    } else if (activePlayers['O'] === null) {
      activePlayers['O'] = playerId;
      console.log('activePlayers o: ', activePlayers);
      socket.emit('joinedGame', { mark: 'O' });
    }
  }

  nextTurn (mark) {
    if (mark === 'X') {
      activePlayer = 'O';
      console.log('activePlayer is O', activePlayer);
    } else {
      activePlayer = 'X';
      console.log('activePlayer is X', activePlayer);
    }
  }

  getKeyByValue (object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}
