import React, { define } from 'react-mvx'
import * as ReactDOM from 'react-dom'
import * as Page from "./Page.jsx";

@define
class TabletView extends React.Component {
    render(){
        const { sys } = this.props.state;

        return <table>
            <thead>
            <th>Module</th>
            <th>Mode</th>
            <th>Temp</th>
            </thead>
            <tbody>
            {
                _.map( ('stellator,smokerecup,coldboiler,hotboiler,airtower,wwrecup,heataccum').split( ',' ),
                    name => <tr key={name}>
                        <td>{name}</td>
                        <td>{sys.system[ name ].mode}</td>
                        <td>{sys.system[ name ].t}</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    }
}

@define
class ModuleView extends React.Component {
    render(){
        const { name, my } = this.props.state;

        return <div>
            <div className='pageTitle'>{'I\'m ' + name}</div>
            <p>Temp = {my.t}</p>
            <p>Mode = {my.mode}</p>
        </div>
    }
}

@define
class Application extends Page.View {
    render(){
        const { name } = this.state,
              View     = name === 'tablet' ? TabletView : ModuleView;

        return <div className={name + '-page page'}><View state={this.state}/></div>
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );