require( 'source-map-support' ).install();
import * as socketio from 'socket.io'
import { SystemState } from "./SystemState.js";
import * as fs from "fs"

require( 'dotenv' ).config();

const SAVED_STATE_FILE = './saved_state.json';

const state = new SystemState(),
      say   = console.log,
      io    = socketio.listen( process.env.central_server_port );

try{
    state.set( JSON.parse( fs.readFileSync( SAVED_STATE_FILE ) ) );
    console.log( 'State restored' );
}
catch( err ){
    console.log( 'Failed to restore a state....' );
}

io.on( 'connection', socket =>{
    socket.on( 'disconnect', () => say( 'WS client is disconnected' ) );
    say( 'WS client is connected' );

    socket.emit( 'news', { hello : 'world' } );

    socket.on( 'hola', data =>{
        say( 'Hola from', data );
        io.sockets.emit( 'sysupdate', state.toJSON() );
    } );

    socket.on( 'settings', data =>{
        state.set( data );
        io.sockets.emit( 'sysupdate', state.toJSON() );
    } )

} );

const grasefulExit = () =>{
    console.log('---------');

    const text = JSON.stringify( state.toJSON() );
    fs.writeFileSync( SAVED_STATE_FILE, text );

    console.log( "Terminating...", text );
    process.abort();
};

process.on( 'SIGINT', grasefulExit );