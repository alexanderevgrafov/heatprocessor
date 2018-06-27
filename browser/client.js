const queryString = require('query-string/index'),
    io = require("socket.io-client/dist/socket.io"),
    params = queryString.parse(window.location.search);


const Application = () => {
    const socket = io.connect('http://127.0.0.1:8001');

    socket.on('connect', () => {
        console.log('Connected to central server');
        socket.emit('hola', {name: params.id || 'Unknown dino'});
    });
};

Application();