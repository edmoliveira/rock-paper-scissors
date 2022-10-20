const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');

let players = [];

let clientCount = 0;

const io = new socketIO.Server(server, {
	cors: {
		origins: ["*"], 
		handlePreflightRequest: (req, res) => {
			const headers = {
				"Access-Control-Allow-Origin": '*', 
				"Access-Control-Allow-Headers": "Content-Type, Authorization",				
				"Access-Control-Allow-Credentials": true
			};
			res.writeHead(200, headers);
			res.end();
		}		
	}
});

io.on('connection', (socket) => {	
    clientCount++;

    socket.on('canPlay', function() {
        io.emit('canPlay', 'start');
    });

    socket.on('addPlayer', function(data) {
        const d = JSON.parse(data);

        if(d.type === 1) {
            players.push(d);
        }

        if(clientCount === 3) {
            console.log('addPlayer:' + players.length);

            if(players.length === 2) {
                start();
            }
            else {
                players = [];
                io.emit('ping', 'searchPlayers');
            }
        }
    });

    socket.on('removePlayer', function(data) {
        players = [];
        io.emit('stop', true);
    });

    socket.on('pong', function(data) {
        const d = JSON.parse(data);

        players.push(d);

        console.log('pong:' + players.length);

        if(players.length === 2) {
            start();
        }
    });

    socket.on('move', function(data) {
        const d = JSON.parse(data);
        const player = players.findIndex(p => p.id === d.id) === 0 ? 1 : 2;

        io.emit('move',  '{"player": ' + player + ', "move": ' + d.move + '}');
    });

    console.log('CONNECTED: ' + socket.handshake.address);
	
	socket.on("disconnect", () => {
        clientCount--;

        players = [];

		console.log('DISCONNECTED: ' + socket.handshake.address);

        io.emit('stop', true);
	});	
	
})

server.listen(3000, '127.0.0.1', () => {
    console.log(`started on port: 3000`);
});

function start() {
    io.emit('start', '{"player1" : "' + players[0].name + '", "player2" : "' + players[1].name + '"}');
}