const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/outputs');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
    entry: {
        index: `${APP_DIR}/app.js`,
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
    },
    module: {
        rules: [ // not 'loaders', 'rules' is correct
            {
                loader: 'babel-loader',
                test: /\.js$/, // regex, js or jsx
                include: APP_DIR,
                exclude: '/node_modules',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
            },
        ],
    },
};

module.exports = config;
