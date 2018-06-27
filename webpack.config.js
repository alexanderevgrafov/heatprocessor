let path = require('path');
let dist = path.join(__dirname, process.env.WEBPACK_DIST || 'bundles');

let config = {
    entry: {
        central: './central.js',
        admin: './admin.js',
        mono: './mono.js'
    },

    output: {
        path: dist,
        publicPath: '/bundles/',
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test    : /\.jsx?$/,
                exclude : /(node_modules|lib)/,
                loader  : 'babel-loader'
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
