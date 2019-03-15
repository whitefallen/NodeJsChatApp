const clientSocket = io();


clientSocket.on('message', (messageText) => {
   console.log(messageText);
});

const messageForm = document.querySelector('#messageForm');

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageText = e.target.elements.messageInput;
    clientSocket.emit('sendMessage', messageText);
});


