// ----------------------- //
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const exprApp = express();
// Create a Plain Server Instanz passing in ExpressApp to Use SocketIO later
const httpServer = http.createServer(exprApp);
// Create SocketIo Instanz based of the Server
const io = socketio(httpServer);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');
// ---------------------- //

// Let Express use a "Public Directory"
exprApp.use(express.static(publicDirPath));

// On Every Event:Connection log to Console
io.on('connection', (socket) => {
    console.log('New Websocket Connection');
    socket.emit('message', `Welcome!`);
    socket.on('sendMessage', (messageText) => {
        io.emit('message',messageText);
    })
});


httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});