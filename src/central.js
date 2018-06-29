require('source-map-support').install();

import { define, Record } from 'type-r'
import socketio from 'socket.io'

require('dotenv').config();

@define
class State extends Record {
    static attributes = {
        smth : "The answer is 42",
        system :  Record.defaults({
            mode: 0,
            airtower: Record.defaults({
                t: 0,
                mode: 0
            })
        }),
        settings : Record.defaults({
            price: Record.defaults({
                electricity_day: 25,
                electricity_night: 12
            })
        })
    }
}

const state = new State(),
    say = console.log,
    io = socketio.listen(process.env.central_server_port);

