require( 'source-map-support' ).install();
import * as socketio from 'socket.io'
import { GlobalState } from "./SystemState.js";
import * as fs from "fs"

require( 'dotenv' ).config();

const SAVED_STATE_FILE = './saved_state.json';

const state = new GlobalState(),
      say   = console.log,
      io    = socketio.listen( process.env.central_server_port );

try{
    state.set( JSON.parse( fs.readFileSync( SAVED_STATE_FILE ) ) );
    console.log( 'State restored' );
}
catch( err ){
    console.log( 'Failed to restore a state....' );
}

state.on( 'change', () =>{
    io.sockets.emit( 'sysupdate', state.toJSON() );

    try{
        fs.writeFileSync( SAVED_STATE_FILE, JSON.stringify( state.toJSON() ) );
    }
} );

io.on( 'connection', socket =>{
    socket.on( 'disconnect', () => say( 'WS client is disconnected' ) );
    say( 'WS client is connected' );

    /*--------- Client connected ------------------*/
    socket.on( 'hola', data =>{
        say( 'Hola from', data );
        io.sockets.emit( 'sysupdate', state.toJSON() );

        switch( data.name ){
            case 'Settings':
                /*--------- Settings page changed parameters -----------*/
                socket.on( 'settings', data =>{
                    state.set( data );
                } );
                break;
            case 'Mono':
                /*--------- Mono controllers touched -----------*/
                socket.on( 'mono-change', data =>{
                    state.setFromMono( data );
                } );

                break;
        }
    } );


    /*--------- Mono controllers touched -----------*/
    socket.on( 'mono-change', data =>{
        state.setFromMono( data );
    } )
} );