const clientSocket = io();

// Elements
const messageForm = document.querySelector('#messageForm');
const messageFormButton = document.querySelector('#messageButton');
const messageInput = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
const rooms = document.querySelector('#chat_rooms');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
// Templates
const chatRoomTemplate = document.querySelector('#room-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

clientSocket.on('message', (message, chatRoom) => {
   console.log(message);
   const html = Mustache.render(messageTemplate, {
       message: message.text,
       createdAt: moment(message.createdAt).format('h:mm a'),
       username: message.username
   });
   messages.insertAdjacentHTML('beforeend', html);

   const htmlRoom = Mustache.render(chatRoomTemplate, {
       chatroom: chatRoom
   });
   rooms.insertAdjacentHTML('beforeend', htmlRoom);
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    messageFormButton.setAttribute('disabled','disabled');
    const messageText = messageInput.value;
    clientSocket.emit('sendMessage', messageText, username, room, (error) => {

        messageFormButton.removeAttribute('disabled');
        messageInput.value = '';
        messageInput.focus();

        if(error) {
          return console.log(error);
        }
        console.log('The message was delivered');
    });
});

clientSocket.emit('join', { username, room});