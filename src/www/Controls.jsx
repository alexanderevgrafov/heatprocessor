import React, { define, Link } from 'nestedreact'
import RcSlider from 'rc-slider'

import 'rc-slider/assets/index.css'

@define
export class Slider extends React.Component {
    static props = {
        label     : '',
        min       : -10,
        max       : 1000,
        valueLink : Link
    };

    render(){
        const { label, min, max, valueLink } = this.props;

        return <div className='c_slider'>
            {label ? <div className="label">{label}</div> : null}
            <RcSlider min={min} max={max} defaultValue={ valueLink.value } onChange={ v=>valueLink.set(v)}/>
            <div className="value">{valueLink.value}</div>
        </div>
    }
}
