import React, { define, Link } from 'react-mvx'
import * as ReactDOM from 'react-dom'
import * as Page from "./Page.jsx";
import { Slider, NumberInput, Input, Select } from "./Controls.jsx";
import { GlobalState, MonoSettings } from "../SystemState.js";
import cx from "classnames"

const handlersOptions = [
    { param : 'system.airtower.t' },
    { param : 'system.hotboiler.t' },
    { param : 'system.airtower.mode' },
    { param : 'system.hotboiler.mode' }
];

@define
class HandlersSettings extends React.Component {
    static props = {
        sys : GlobalState.has.events( { change : 'onSysChange' } )
    };

    static state = {
        conf : MonoSettings
    };

    onSysChange(){
        this.state.conf.assignFrom( this.props.sys )
    }

    onSave = () => this.props.sys.assignFrom( this.state.conf );

    render(){
        const { conf } = this.state;

        return <div className="control-group handlers-assos">
            <NumberInput valueLink={conf.linkAt( 'rate' )}/>
            {
                _.map( _.range( 8 ), num =>{
                    const h = conf[ 'h' + num ];
                    return <div key={num}>
                        {'Handler #' + (num + 1)}
                        <Select valueLink={h.linkAt( 'param' )}>
                            <option value=''>-------------</option>
                            {
                                _.map( handlersOptions, opt =>
                                    <option key={opt.param}>{opt.param}</option> )
                            }
                        </Select>
                        <NumberInput valueLink={h.linkAt( 'rate' )}/>
                    </div>
                } )
            }
            <button onClick={this.onSave}>Save handlers</button>
        </div>
    }
}

@define
class Sliders extends React.Component {

    render(){
        const { sys } = this.props;
        return <div className="control-group sliders">
            <Slider valueLink={sys.system.airtower.linkAt( 't' )} min={-120} max={120} label="Air Tower temperature"/>
            <Slider valueLink={sys.system.hotboiler.linkAt( 't' )} min={-120} max={120} label="Hot Boiler temperature"/>
        </div>
    }
}

@define
class PageState extends Page.State {
    static attributes = {
        name        : 'Settings',
        isConnected : false,
        sys         : GlobalState.has.watcher( function(){this.getOwner().onSystemChange()} ),


        fake_mono : '[2,3,0,0,0,0,0,0]'
    }
}

@define
class Application extends Page.View {
    static State = PageState;

    componentWillMount(){
        this.emitChangesDebounced = _.debounce( this.emitChanges, 500 );
    }

    onConnect(){
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

    fakeMonoData = () =>{
        const { fake_mono, socket } = this.state;

        try{
            let fakes = JSON.parse( fake_mono );
            console.log( 'Send as mono', fakes );
            socket.emit( 'mono-change', fakes );

        }
        catch( err ){
            console.log( 'Mono fakes not parsable ', fake_mono )
        }
    };

    render(){
        const { name, sys, isConnected } = this.state;

        return <div className='settings-page page'>
            <div className={cx( 'pageTitle', { isConnected } )}>{'I\'m ' + name}{}</div>
            <Sliders sys={sys}/>
            <HandlersSettings sys={sys.settings.mono}/>


            <Input valueLink={this.state.linkAt( 'fake_mono' )}/>
            <button onClick={this.fakeMonoData}>Send mono data</button>
        </div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );