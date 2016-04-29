var path = require('path');
var CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;

module.exports = {
    entry: {
      bill: path.resolve(__dirname, './src/js/page/bill.js'),
      register: path.resolve(__dirname, './src/js/page/register.js'),
      reset: path.resolve(__dirname, './src/js/page/reset.js')
    },
    output: {
        path: path.resolve(__dirname, './dist/js/page'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
        ]
    },
    resolve:{
        extensions:['','.js','.json', 'css']
    },
    plugins: [
    ]
};
