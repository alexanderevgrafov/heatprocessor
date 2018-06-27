const cfg = require('./config.json'),
    say = console.log,
    cs_connection = require('socket.io-client')('http://' + cfg.central_server_ip + ':' + cfg.server_port);

cs_connection.on('connect', () => {
    say('Connected to central server');
    cs_connection.emit('hola', {name: 'Admin node'});
});

cs_connection.on('error', err => say('Connection error'));
cs_connection.on('disconnect', () => say('Disconnection'));
cs_connection.on('reconnect', num => say('Reconnected after ' + num + ' attempts'));
cs_connection.on('reconnect_error', err => say('Reconnection error'));

cs_connection.on('news', data => {
    say('News from central server:', data);
});

