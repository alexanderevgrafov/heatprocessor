requirejs.config({
    baseUrl: "../node_modules",
    paths: {
        underscore: "underscore/underscore-min",
        jquery: 'jquery/dist/jquery.min',
        io: "socket.io-client/dist/socket.io",
        text: 'requirejs-plugins/lib/text',
        json: 'requirejs-plugins/src/json'
    },
    shim: {
        "underscore": {exports: "_"},
        "jquery": {exports: "$"}
    }
});

require(['jquery','underscore','../browser/client'], app => new app.browserController());
