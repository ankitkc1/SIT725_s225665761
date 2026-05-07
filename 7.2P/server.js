
const express = require('express');
const app = express();

//create HTTP server from Express app
const http = require('http').createServer(app);

//attach Socket.IO to the HTTP server
const io = require('socket.io')(http);

const PORT = 3000;

//serve static files from public folder
app.use(express.static('public'));

let onlineUsers = 0;

//socket.IO connection
io.on('connection', (socket) => {
  onlineUsers++;
  console.log('A staff user connected');

  //send online user count to all connected users
  io.emit('onlineCount', onlineUsers);

  //listen for message from client
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);

    //send message to all connected clients
    io.emit('receiveMessage', messageData);
  });

  //listen for typing message
  socket.on('typing', (staffName) => {
    socket.broadcast.emit('typing', staffName);
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });

  // When user disconnects
  socket.on('disconnect', () => {
    onlineUsers--;
    console.log('A staff user disconnected');
    io.emit('onlineCount', onlineUsers);
  });
});

//start server
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
