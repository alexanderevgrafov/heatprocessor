define(function (require, exports, module) {
    const $ = require('jquery'),
//        _ = require('_'),
        queryString = require('query-string/index'),
       io = require("io"),
        params = queryString.parse(window.location.search);
        
        

    module.exports.browserController = function () {
        const socket = io.connect('http://127.0.0.1:8001');

        console.log('URL params are ', params);

        socket.on('connect', () => {
            console.log('Connected to central server');
            socket.emit('hola', {name: params.id || 'Unknown dino'});
        });
    };
});
