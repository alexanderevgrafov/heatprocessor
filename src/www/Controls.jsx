import React, { define, Link } from 'react-mvx'
import RcSlider from 'rc-slider'
import cx from "classnames"

import 'rc-slider/assets/index.css'

@define
export class Input extends React.Component {
    render(){
        const { valueLink, ...props } = this.props,
              Tag                     = props.type === 'number' ? NumberInput : TextInput;

        return <Tag {...props} valueLink={valueLink}/>;
    }
}

@define
export class TextInput extends React.Component {
    render(){
        const { accepts, onChange, valueLink, value, ...props } = this.props;
        return <input {...props}
                      onKeyDown={e =>{
                          props.onKeyDown && props.onKeyDown( e );
                      }}
                      onChange={e =>{
                          if( !accepts || e.target.value.match( accepts ) ){
                              onChange && onChange( e );
                              valueLink && valueLink.set( e.target.value );
                          }
                      }}
                      value={valueLink ? valueLink.value : value}
        />
    }
}

@define
export class NumberInput extends React.Component {
    componentWillMount(){
        this.setAndConvert( this.props.valueLink.value );
    }

    componentWillReceiveProps( nextProps ){
        const { valueLink : next } = nextProps;

        if( Number( this.props.valueLink.value ) === Number( this.value ) &&
            Number( next.value ) !== Number( this.value ) ){
            this.setAndConvert( next.value ); // keep state being synced
        }
    }

    setValue( x ){
        // We're not using native state in order to avoid race condition.
        this.value = String( x );
        this.error = isNaN( Number( x ) );
        this.forceUpdate();
    }

    setAndConvert( x ){
        let value = Number( x );

        if( this.props.positive ){
            value = Math.abs( x );
        }

        if( this.props.integer ){
            value = Math.round( value );
        }

        this.setValue( value );
    }

    onKeyPress = e =>{
        const { charCode }          = e,
              { integer, positive } = this.props,
              allowed               = (positive ? [] : [ 45 ]).concat(
                  integer ? [] : [ 46 ] );

        if( e.ctrlKey ){
            return;
        }

        if( charCode && // allow control characters
            (charCode < 48 || charCode > 57) && // char is number
            allowed.indexOf( charCode ) < 0 ){ // allowed char codes
            e.preventDefault();
        }
    };

    onChange = e =>{
        // Update local state...
        const { value }   = e.target,
              { accepts } = this.props;
        if( accepts && !value.match( accepts ) ){
            return;
        }

        this.setValue( value );

        const asNumber = Number( value );

        if( value && !isNaN( asNumber ) ){
            this.props.valueLink.update( x =>{
                // Update link if value is changed
                if( asNumber !== Number( x ) ){
                    return asNumber;
                }
            } );
        }
    };

    onBlur = () =>{
        if( this.value === '' ){
            this.setValue( 0 );
            this.props.valueLink.set( 0 );
        }
    };

    render(){
        const { type, invalid = 'invalid', className = '', valueLink, integer, positive, collection, accepts, ...props } = this.props;

        return <input {...props}
                      type="text"
                      className={cx( className, { invalid : this.error } )}
                      value={this.value}
                      onKeyPress={this.onKeyPress}
                      onBlur={this.onBlur}
                      onChange={this.onChange}/>;
    }
}


@define
export class Select extends React.Component {
    render(){
        const { valueLink, children, ...props } = this.props;
        return <select
            onChange={e => valueLink && valueLink.set( e.target.value )}
            value={valueLink && valueLink.value}
            {...props}
        >
            {children}
        </select>;
    }
}

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
            <div className="value">{valueLink.value}</div>
            <RcSlider min={min} max={max} value={valueLink.value} onChange={v => valueLink.set( v )}/>
        </div>
    }
}

