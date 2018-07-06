require( 'source-map-support' ).install();
import * as socketio from 'socket.io'
import { GlobalState } from "./SystemState.js";
import * as _ from 'underscore'
import * as fs from "fs"

require( 'dotenv' ).config();

const io = socketio.listen( process.env.central_server_port );

/*------- WWW server -----------*/
let express       = require( 'express' ),
    webserver_app = express(),
    web_server    = require( 'http' ).Server( webserver_app );

webserver_app.use( '/', express.static( __dirname + '/www' ) );//;
web_server.listen( process.env.web_server_port );
console.log('Serving port ', process.env.web_server_port, ' with ', __dirname + '/www' )

/*---------------- Global state --------------------*/
const SAVED_STATE_FILE = './saved_state',
      state            = new GlobalState(),
      writeState       = _.debounce( () =>{
          try{fs.writeFileSync( SAVED_STATE_FILE, JSON.stringify( state.toJSON() ) )}
          catch( err ){}
      }, 5000 );

try{
    state.set( JSON.parse( fs.readFileSync( SAVED_STATE_FILE ) ) );
    console.log( 'State restored' );
}
catch( err ){
    console.log( 'Failed to restore a state....' );
}

state.on( 'change', () =>{
    io.sockets.emit( 'sysupdate', state.toJSON() );
    writeState();
} );

/*-----------------------------------------------------------------*/
/*------------ MAIN logic - sockets serving -----------------------*/
io.on( 'connection', socket =>{
    socket.on( 'disconnect', () => console.log( 'WS client is disconnected' ) );
    console.log( 'WS client is connected' );

    /*--------- Client connected ------------------*/
    socket.on( 'hola', data =>{
        console.log( 'Hola from', data );
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

    /*--------- TODO: make sure Mono server send 'hola' with 'Mono' name & REMOVE this listner from here -----------*/
    socket.on( 'mono-change', data =>{
        state.setFromMono( data );
    } )
} );
