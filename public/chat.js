const socket = io.connect('http://localhost:4000');

const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const handle = document.getElementById('handle');
const message = document.getElementById('message');
const button = document.getElementById('send');

button.addEventListener('click', () => {
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
  message.value = '';
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', (data) => {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
