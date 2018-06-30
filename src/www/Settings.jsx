import React, { define } from 'nestedreact'
import * as ReactDOM from 'react-dom'
import { Page } from "./Page.jsx";
import { Slider } from "./Controls.jsx";
import { SystemState } from "../SystemState.js";
import cx from "classnames"


@define
class Application extends Page {
    static state = {
        name        : 'Settings',
        isConnected : false,
        sys         : SystemState.has.watcher( function(){this.getOwner().onSystemChange()} )
    };

    onConnect = () =>{
        const { socket, name } = this.state;

        console.log( 'Connected to central server' );
        this.state.isConnected = true;
        socket.emit( 'hola', { name } );
    };

    onSystemUpdate = data =>{
        const { socket, name, sys } = this.state;

        sys.set( data );

        console.log( 'system state is ', sys );
    };

    onSystemChange(){
        const { socket, sys } = this.state;

        socket.emit( 'settings', sys );
    }

    render(){
        const { name, sys, isConnected } = this.state;

        return <div className='settings-page page'>
            <div className={cx( 'pageTitle', { isConnected } )}>{'I\'m ' + name}{}</div>
            <Slider valueLink={sys.deepLink( 'system.airtower.t' )} min={-120} max={120} label="Air Tower temperature"/>
        </div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );
