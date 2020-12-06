const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    mode: 'development',
    devServer: {
        https: true,
        historyApiFallback: true,
        port: 3000
    },
    devtool: 'eval-cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?/i,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css?/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.template.html'),
        }),
    ]
}
