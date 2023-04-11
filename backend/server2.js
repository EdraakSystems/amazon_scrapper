const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.options('*', cors())

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });

io.on('connection', (socket) => {
  console.log('a user connected');
  setInterval(() => {
    socket.emit('data', Math.random());
  }, 1000);
});

http.listen(4000, () => {
  console.log('listening on *:4000');
});