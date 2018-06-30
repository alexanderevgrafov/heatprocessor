import React, { define } from 'react-mvx'
import * as ReactDOM from 'react-dom'
import * as Page from "./Page.jsx";
import { Slider } from "./Controls.jsx";
import { SystemState } from "../SystemState.js";
import cx from "classnames"

@define
class PageState extends Page.State {
    static attributes = {
        name        : 'Settings',
        isConnected : false,
        sys         : SystemState.has.watcher( function(){this.getOwner().onSystemChange()}        )
    }
}

@define
class Application extends Page.View {
    static State = PageState;

    componentWillMount() {
        this.emitChangesDebounced = _.debounce( this.emitChanges, 500);
    }

    onConnect() {
        const { socket, name } = this.state;

        socket.emit( 'hola', { name } );
        this.state.isConnected = true;
    };

    onSystemChange(){
        this.emitChangesDebounced()
    }

    emitChanges(){
        const { socket, sys } = this.state;

        socket.emit( 'settings', sys );
    }

    render(){
        const { name, sys, isConnected } = this.state;

        return <div className='settings-page page'>
            <div className={cx( 'pageTitle', { isConnected } )}>{'I\'m ' + name}{}</div>
            <Slider valueLink={sys.system.airtower.linkAt( 't' )} min={-120} max={120} label="Air Tower temperature"/>
            <Slider valueLink={sys.system.hotboiler.linkAt( 't' )} min={-120} max={120} label="Hot Boiler temperature"/>
        </div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );