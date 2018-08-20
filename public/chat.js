const socket = io.connect('http://localhost:4000');

const title = document.getElementById('title');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const message = document.getElementById('message');
const button = document.getElementById('send');

let id = null;
let playerNum = null;
let currentlyTyping = false;
let mark = null;

// Listen for events
socket.on('connected', (data) => {
  id = data.id;
  playerNum = data.playerNum;
  console.log(`id: ${id}, playerNum: ${playerNum}`)
  title.innerHTML = `Player${playerNum}`;
});

socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', (data) => {
  if (data.typing) {
    feedback.innerHTML = `<p><em>${data.handle} is typing a message...</em></p>`;
  } else {
    feedback.innerHTML = '';
  }
});

socket.on('joinedGame', (data) => {
  console.log(`Joined game as ${data.mark}'s`);
  mark = data.mark;
  output.innerHTML += `<p><strong>You joined the game as ${mark}'s</strong></p>`;
});

socket.on('move', (data) => {
  const square = document.getElementById(data.squareId);
  const mark = data.mark;

  console.log(`Making move ${mark} on ${data.squareId}`);
  square.setAttribute('data-mark', mark);
  square.innerHTML = mark;
});

// tic-tac-toe
document.addEventListener('click', (event) => {
  if (!event.target.classList.contains('square')) return;

  const square = event.target;
  if (square.getAttribute('data-mark') === null) {
    socket.emit('move', { id: id, squareId: square.id });
  }
});

// chat
message.addEventListener('input', (event) => {
  if (currentlyTyping === !!message.value) return;
  currentlyTyping = !!message.value;
  socket.emit('typing', { id: id, typing: currentlyTyping });
});

button.addEventListener('click', () => {
  socket.emit('chat', { id: id, message: message.value });
  message.value = '';
});
