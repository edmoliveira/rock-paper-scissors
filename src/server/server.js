const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');

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

    socket.on('move', function(data) {
        io.emit('move', data);
    });

    console.log('CONNECTED: ' + socket.handshake.address);

    if(clientCount === 3) {
        setTimeout(() => {
            io.emit('start', true);
        }, 500);
    }
	
	socket.on("disconnect", () => {
        clientCount--;
		console.log('DISCONNECTED: ' + socket.handshake.address);

        io.emit('stop', true);
	});	
	
})

server.listen(3000, '127.0.0.1', () => {
    console.log(`started on port: 3000`);
});