//socket.emit('CH01', 'me', 'test msg');

var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('canPlay', function () {
    readline.question('Play: ', move => {
        socket.emit('move', '{"player": 2, "move": ' + move + '}');
    });
});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('close', function() {
    readline.close();
	console.log('Connection closed');
});