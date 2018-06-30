import  React, { define } from 'react-mvx'
import * as ReactDOM from 'react-dom'
import * as Page from "./Page.jsx";

@define
class Application extends Page.View {

    render(){
        const { name, my } = this.state;

        return <div className='module-page page'>
            <div className='pageTitle'>{'I\'m ' + name}</div>
            <p>Temp = { my.t }</p>
            <p>Mode = { my.mode }</p>
        </div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );
