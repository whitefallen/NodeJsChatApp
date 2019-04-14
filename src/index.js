// ----------------------- //
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');
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

// Rooms
let chatRooms = [];

// On Every Event:Connection log to Console
io.on('connection', (socket) => {
    console.log('New Websocket Connection');

    socket.on('join', ({ username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username: username, room: room});
        if(error) {
            return callback(error);
        }
        socket.join(user.room);

       if(!chatRooms.includes(user.room)) {
           chatRooms.push(user.room);
       }
       socket.emit('message', generateMessage(`Welcome`, 'Discordify-System'), chatRooms);
       socket.broadcast.to(user.room).emit('message', generateMessage(`A new User ${user.username} has Joined the Frey.`, 'Discordify-System'));

       io.to(user.room).emit('roomData', {
           room:user.room,
           users: getUsersInRoom(user.room)
       });

       callback();
    });

    socket.on('sendMessage', (messageText, username, room, callback) => {
        const filter = new Filter();
        if(filter.isProfane(messageText)) {
          return callback('Profanity is not allowed!');
        }
        io.to(room).emit('message', generateMessage(messageText, username));
        callback('');
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.emit('message', generateMessage(`${user.username} has left ${user.room}!`, 'Discordify-System'));
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});