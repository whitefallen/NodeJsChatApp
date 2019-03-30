// ----------------------- //
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');

const exprApp = express();
// Create a Plain Server passing in ExpressApp to Use SocketIO later
const httpServer = http.createServer(exprApp);
// Create SocketIo
const io = socketio(httpServer);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');
// ---------------------- //

// Let Express use a "Public Directory"
exprApp.use(express.static(publicDirPath));

// On Every Event:Connection log to Console
io.on('connection', (socket) => {
    console.log('New Websocket Connection');



    socket.on('join', ({ username, room}) => {
       socket.join(room);

       socket.emit('message', generateMessage(`Welcome`));
       socket.broadcast.to(room).emit('message', generateMessage(`A new User ${username} has Joined the Frey.`));

    });

    socket.on('sendMessage', (messageText, username, callback) => {
        const filter = new Filter();
        if(filter.isProfane(messageText)) {
          return callback('Profanity is not allowed!');
        }
        io.to('Five').emit('message', generateMessage(messageText, username));
        callback('');
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage(`A User have left.`));
    });
});


httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});