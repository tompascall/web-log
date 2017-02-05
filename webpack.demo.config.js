var path = require('path');

module.exports = {
  entry: "./demo/demo",

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "demo", "bin"), // string

    filename: "demo.js", // string
    // the filename template for entry chunks
  },

  module: {
    // configuration regarding modules

    loaders: [
    {
        test: /\.js$/,
        exclude: /node_modules/,

        loader: "babel-loader",

        options: {
          presets: ["es2015"]
        },
      }
    ]
  },

  performance: {
    hints: "warning", 
  },

  devtool: "source-map",

  context: __dirname, // string (absolute path!)

  target: "node", // enum

  stats: {
    /* TODO */
  },

  devServer: {
    /* TODO */
  },

  plugins: [
    // ...
  ],
}
