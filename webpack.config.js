var path = require('path');

module.exports = {
  entry: "./src/weblog",

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "bin"), // string

    filename: "weblog.js", // string
    // the filename template for entry chunks
  },

  module: {
    // configuration regarding modules

    rules: [
      // rules for modules (configure loaders, parser options, etc.)

      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: /node_modules/,

        loader: "babel-loader",

        options: {
          presets: ["es2015"]
        },
        // options for the loader
      },

    ],
  },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    // directories where to look for modules

    extensions: [".js", ".json", ".jsx"],
    // extensions that are used
  },

  performance: {
    hints: "warning", // enum
  },

  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.

  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory

  target: "node", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules

  stats: {
    /* TODO */
  },

  devServer: {
    /* TODO */
  },

  plugins: [
    // ...
  ],
  // list of additional plugins
}
