const cfg = require('./config.json'),
    say = console.log,
    _sio = require('socket.io');

const io = _sio.listen(cfg.server_port);

io.on('connection', socket => {
    socket.on('disconnect', () => say('WS client is disconnected'));
    say('WS client is connected');

    socket.emit('news', {hello: 'world'});

    socket.on('hola', data => {
        say('Hola from', data);
        io.sockets.emit('news', {welcome: data.name});
    });
});
