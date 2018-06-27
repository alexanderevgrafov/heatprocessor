let webpack = require('webpack');
let path = require('path');
//let Clean                 = require( 'clean-webpack-plugin' );

let dist = path.join(__dirname, process.env.WEBPACK_DIST || 'bundles');

let config = {
    mode: 'development',

    entry: './browser/client.js',

    output: {
        path: dist,
        publicPath: '/bundles/',
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

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
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
