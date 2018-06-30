require('source-map-support').install();
import * as socketio from 'socket.io'
import { SystemState } from "./SystemState.js";

require('dotenv').config();

const state = new SystemState(),
    say = console.log,
    io = socketio.listen(process.env.central_server_port);

io.on('connection', socket => {
    socket.on('disconnect', () => say('WS client is disconnected'));
    say('WS client is connected');

    socket.emit('news', {hello: 'world'});

    socket.on('hola', data => {
        say('Hola from', data);
        io.sockets.emit('sysupdate', state.toJSON());
    });

    socket.on('settings', data => {
        state.set(data);
        io.sockets.emit('sysupdate', state.toJSON());
    })

});
