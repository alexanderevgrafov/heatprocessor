import { define, Record } from 'type-r'

@define
export class System extends Record {
    static attributes = {
        mode      : 0,
        airtower  : Record.defaults( {
            t    : 0,
            mode : 0
        } ),
        hotboiler : Record.defaults( {
            t    : 0,
            mode : 0
        } )
    }
}

@define
export class MonoHandlerConf extends Record {
    static attributes = {
        param : '',
        rate  : 1
    }
}

@define
export class MonoSettings extends Record {
    static attributes = {
        rate : 50,
        h0   : MonoHandlerConf,
        h1   : MonoHandlerConf,
        h2   : MonoHandlerConf,
        h3   : MonoHandlerConf,
        h4   : MonoHandlerConf,
        h5   : MonoHandlerConf,
        h6   : MonoHandlerConf,
        h7   : MonoHandlerConf
    }
}

@define
export class Settings extends Record {
    static attributes = {
        price : Record.defaults( {
            electricity_day   : 25,
            electricity_night : 12
        } ),
        mono  : MonoSettings
    }
}

@define
export class GlobalState extends Record {
    static attributes = {
        system   : System,
        settings : Settings
    };

    setFromMono( arr ){
        const conf = this.settings.mono;
        console.log( 'Mono info is', arr );

        [ 0, 1, 2, 3, 4, 5, 6, 7 ].forEach( num =>{
            if( arr[ num ] ){
                const h = conf[ 'h' + num ];
                h.param && this.deepSet( h.param, this.deepGet( h.param ) + arr[ num ] * h.rate )
            }
        } );
    }
}