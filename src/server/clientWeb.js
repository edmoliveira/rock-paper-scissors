var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

let player1 = null;
let player2 = null;

socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('move', function (data) {
    const d = JSON.parse(data);

    if(d.player === 1) {
        player1 = d.move;
    }
    else if(d.player === 2) {
        player2 = d.move;
    }

    if(player1 != null && player2 != null) {
        const result = compare(player1, player2);

        if(result === 0) {
            console.log('Tie Game');
        }
        else {
            console.log((result === 1 ? 'Player 1' : 'Player 2') + ' won!');
        }

        player1 = null;
        player2 = null;

        socket.emit('canPlay', true);
    }
});

socket.on('close', function() {
	console.log('Connection closed');
});

setTimeout(() => {
    socket.emit('canPlay', true);
}, 2000)

compare = (jog1, jog2) => jog1 === jog2 ? 0 : (jog2 + 1) % 3 === jog1 ? 1 : 2;