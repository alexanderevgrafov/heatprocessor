import React, { define, Collection, Record } from 'nestedreact'
import * as queryString from 'query-string'
import * as io from 'socket.io-client'
import './styles.less'

@define
export class Page extends React.Component {
    static state = {
        name   : 'Unknown dino',
        host   : '127.0.0.1:8001',
        socket : null
    };

    componentWillMount(){
        const { state } = this,
              params    = _.extend( {}, queryString.parse( window.location.search ) );

        state.set( params );

        state.socket = io.connect( 'http://' + state.host );

        state.socket.on( 'connect', this.onConnect );
        state.socket.on( 'sysupdate', this.onSystemUpdate );
    }
}