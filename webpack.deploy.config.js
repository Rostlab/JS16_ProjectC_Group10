var webpack = require("webpack");

module.exports = {
    entry:  {
        deploy: "./mockup/deploy.js"
    },
    output: {
        path:     'builds',
        filename: '[name].bundle.js',
        publicPath: 'builds/',
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.(png|jpg|svg|jpeg)/, loaders: ['url', 'image-webpack']},
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.less$/,loader: "style!css!less"}
         ]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

    ]
};
