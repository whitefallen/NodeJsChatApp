const clientSocket = io();

clientSocket.on('message', (messageText) => {
   console.log(messageText);
});

const messageForm = document.querySelector('#messageForm');
const messageFormButton = document.querySelector('#messageButton');
const messageInput = document.querySelector('#messageInput');

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    messageFormButton.setAttribute('disabled','disabled');
    const messageText = messageInput.value;
    clientSocket.emit('sendMessage', messageText, (error) => {
        
        messageFormButton.removeAttribute('disabled');
        messageInput.value = '';
        messageInput.focus();

        if(error) {
          return console.log(error);
        }
        console.log('The message was delivered');
    });
});


