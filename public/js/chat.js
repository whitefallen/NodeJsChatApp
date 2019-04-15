const clientSocket = io();

// Elements
const messageForm = document.querySelector('#messageForm');
const messageFormButton = document.querySelector('#messageButton');
const messageInput = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
let { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
username = username.toLowerCase();
room = room.toLowerCase();

clientSocket.on('message', (message, chatRoom) => {
   console.log(message);
   const html = Mustache.render(messageTemplate, {
       message: message.text,
       createdAt: moment(message.createdAt).format('h:mm a'),
       username: message.username
   });
   messages.insertAdjacentHTML('beforeend', html);

});

clientSocket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room: room,
        users:users
    });
    sidebar.innerHTML = html;
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

clientSocket.emit('join', { username, room}, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
});