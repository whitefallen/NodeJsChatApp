const clientSocket = io();
let counterButton = document.querySelector('#increment');

clientSocket.on('countInit', (counter) => {
    console.log(`The Count has been received its currently: ${counter}`);
});

counterButton.addEventListener('click', () => {
    console.log('Clicked');
    clientSocket.emit('incrementCounter');
});

clientSocket.on('countUpdated', (counter) => {
    console.log(`The Count has been updated its currently: ${counter}`);
});



