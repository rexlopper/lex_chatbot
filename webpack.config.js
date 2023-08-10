/**
 * @fileoverview Config for the webpack for the entry and output points.
 * The browser can't reference the `node_modules` folder so we can't do the usual import.
 * @author Rex Von Brixon Aparece Apa-ap
 * @version 1.0.0
 */

const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: "development",
    context: __dirname,
    entry: './src/widget/script.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new Dotenv()
        ]
};