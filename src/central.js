import { Record } from 'type-r'
import socketio from 'socket.io'

require('dotenv').config();

class State extends Record`` {
    static smth = "The answer is 42";

    static system =  Record.defaults({
        mode: 0,
        airtower: Record.defaults({
            t: 0,
            mode: 0
        })
    });

    static settings = Record.defaults({
        price: Record.defaults({
            electricity_day: 25,
            electricity_night: 12
        })
    });
}

const state = new State(),
    say = console.log,
    io = socketio.listen(process.env.central_server_port);

