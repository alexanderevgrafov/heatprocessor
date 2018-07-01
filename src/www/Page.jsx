import React, { define } from 'react-mvx'
import { Record } from 'type-r'
import * as queryString from 'query-string'
import * as io from 'socket.io-client'
import { GlobalState } from "../SystemState.js";
import * as client_conf from '../client-conf.json'
import './styles.less'

@define
export class State extends Record {
    static attributes = {
        name   : 'Unknown dino',
        sys    : GlobalState,
        socket : null
    };

    get my(){ return this.sys.system[ this.name ] || {}}
}

@define
export class View extends React.Component {
    static State = State;

    componentWillMount(){
        const { state } = this,
              params    = _.extend( {}, queryString.parse( window.location.search ) );

        state.set( params );

        state.socket = io.connect( 'http://' + params.server || client_conf.central_server_host );

        state.socket.on( 'connect', ()=>this.onConnect() );
        state.socket.on( 'sysupdate', d=>this.onSystemUpdate(d) );
    }

    onConnect() {
        const { socket, name } = this.state;

        console.log( 'Connected to central server' );
        socket.emit( 'hola', { name } );
    }

    onSystemUpdate( data) {
        const { sys } = this.state;

        sys.set( data );
        console.log('System update', data)
    }
}