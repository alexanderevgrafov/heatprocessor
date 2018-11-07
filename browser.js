requirejs.config({
    baseUrl: "libs",
    paths: {
        'app':'./..',
        'underscore': "underscore-min",
        "io": "../node_modules/socket.io/node_modules/socket.io-client/socket.io"
    },
    shim: {
        "underscore": { exports: "_"},
        "jquery": { exports: "$" },
        "jquery-ui": { deps: ["jquery"]},
        "draggable": { deps: ["jquery"]}
    }
});

require(['jquery-ui', 'app/tableMain'], (j, app) => new app.browserController());
