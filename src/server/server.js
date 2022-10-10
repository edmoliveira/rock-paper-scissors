const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');

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
    socket.on('canPlay', function() {
        console.log('canPlay');
        io.emit('canPlay', 'start');
    });

    socket.on('move', function(data) {
        console.log(data);
        io.emit('move', data);
    });

    console.log('CONNECTED: ' + socket.handshake.address);
	
	socket.on("disconnect", () => {
		console.log('DISCONNECTED: ' + socket.handshake.address);
	});	
	
})

server.listen(3000, '127.0.0.1', () => {
    console.log(`started on port: 3000`);
});