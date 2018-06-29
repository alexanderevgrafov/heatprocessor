let webpack = require('webpack');
let path = require('path');
//let Clean                 = require( 'clean-webpack-plugin' );

let dist = path.join(__dirname, process.env.WEBPACK_DIST || 'dist');

let config = {
    mode: 'development',
    
    entry: './src/www/client.js',

    output: {
        path: dist,
        filename: 'client.js'
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
