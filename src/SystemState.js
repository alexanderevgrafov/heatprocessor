import { define, Record } from 'type-r'

@define
export class SystemState extends Record {
    static attributes = {
        system   : Record.defaults( {
            mode     : 0,
            airtower : Record.defaults( {
                t    : 0,
                mode : 0
            } ),
            hotboiler : Record.defaults( {
                t    : 0,
                mode : 0
            } )
        } ),
        settings : Record.defaults( {
            price : Record.defaults( {
                electricity_day   : 25,
                electricity_night : 12
            } )
        } )
    }
}