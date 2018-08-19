const socket = io.connect('http://localhost:4000');

const title = document.getElementById('title');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const message = document.getElementById('message');
const button = document.getElementById('send');

let id = null;
let playerNum = null;
let currentlyTyping = false;

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

// tic-tac-toe
socket.on('move', (data) => {
  console.log(`Making move on ${data}`);
  document.getElementById(data).innerHTML = 'X';
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
