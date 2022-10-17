const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('What is your name?: ', name => {
    const io = require('socket.io-client');
    const socket = io.connect('http://localhost:3000', {reconnect: true});
    const uuid = require('uuid');
    const id = uuid.v1();
    const data = '{"type": 1, "id": "' + id + '", "name": "' + name + '"}';

    socket.on('canPlay', function () {
        readline.question('Play: ', move => {
            socket.emit('move', '{"id": "' + id + '", "move": ' + move + '}');
        });
    });

    socket.on('ping', function () {
        socket.emit('pong', data);
    });
    
    socket.on('connect', function () {
        console.log('Connected!');

        setTimeout(() => {
            socket.emit('addPlayer', data);
        }, 500);
    });
    
    socket.on('close', function() {
        readline.close();
        console.log('Connection closed');
    });
});