import React, { define, Collection, Record } from 'nestedreact'
import * as ReactDOM from 'react-dom'
import { Page } from "./Page.jsx";

@define
class Application extends Page {
    onConnect = () =>{
        const { socket, name } = this.state;

        console.log( 'Connected to central server' );
        socket.emit( 'hola', { name } );
    };

    onSystemUpdate = sys =>{
        const { socket, name } = this.state;

        console.log( 'system state is ', sys );
    };

    render(){
        const { name } = this.state;

        return <div className='module-page page'>
            <div className='pageTitle'>{'I\'m ' + name}</div>
        </div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );
