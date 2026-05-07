//Connect to Socket.IO server
const socket = io();

const staffNameInput = document.getElementById('staff-name');
const staffRoleInput = document.getElementById('staff-role');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const messageList = document.getElementById('message-list');
const onlineCount = document.getElementById('online-count');
const typingMessage = document.getElementById('typing-message');

//send message to server
sendButton.addEventListener('click', () => {
  const staffName = staffNameInput.value.trim();
  const staffRole = staffRoleInput.value;
  const message = messageInput.value.trim();

  if (staffName === '' || message === '') {
    alert('Please enter staff name and message.');
    return;
  }

  const messageData = {
    name: staffName,
    role: staffRole,
    message: message,
    time: new Date().toLocaleTimeString()
  };

  socket.emit('sendMessage', messageData);
  socket.emit('stopTyping');

  messageInput.value = '';
});

//listen for messages from server
socket.on('receiveMessage', (messageData) => {
  const messageBox = document.createElement('div');
  messageBox.classList.add('message-box');

  messageBox.innerHTML = `
    <p><strong>${messageData.role}: ${messageData.name}</strong></p>
    <p>${messageData.message}</p>
    <small>${messageData.time}</small>
  `;

  messageList.appendChild(messageBox);
  messageList.scrollTop = messageList.scrollHeight;
});

//listen for online staff count
socket.on('onlineCount', (count) => {
  onlineCount.textContent = count;
});

//simple typing feature
messageInput.addEventListener('input', () => {
  const staffName = staffNameInput.value.trim();

  if (staffName !== '') {
    socket.emit('typing', staffName);
  }

  if (messageInput.value.trim() === '') {
    socket.emit('stopTyping');
  }
});

socket.on('typing', (staffName) => {
  typingMessage.textContent = `${staffName} is typing...`;
});

socket.on('stopTyping', () => {
  typingMessage.textContent = '';
});
