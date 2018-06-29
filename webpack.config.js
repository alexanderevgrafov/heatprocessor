let webpack = require('webpack');
let path = require('path');
//let Clean                 = require( 'clean-webpack-plugin' );

let dist = path.join(__dirname, process.env.WEBPACK_DIST || 'bundles');

let config = {
    mode: 'development',

    entry: './src/central.js',
//    entry: './src/www/client.js',
/*
    entry: {
        www:'./src/www/client.js',
        central:'./src/central.js'
    },
*/  
    output: {
        path: dist,
        publicPath: '/dist/',
        filename: '[name].js',
    },

    devtool: 'source-map',

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            _: "underscore"
        }),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new webpack.optimize.OccurrenceOrderPlugin(true)
    ],

   resolve : {
        modules : [ './node_modules'],
        extensions : [ '.ts', '.js' ]
    },

    module: {
        rules: [
            {
                test    : /\.jsx?$/,
                exclude : /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            },

            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(jpg|gif)$/,
                loader: "file-loader"
            }
        ]
    }
};

module.exports = config;
