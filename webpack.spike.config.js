var path = require('path');

module.exports = {
  entry: "./spike/search",

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "spike", "bin"), // string

    filename: "spike.js", // string
    // the filename template for entry chunks
  },

  module: {
    // configuration regarding modules

    loaders: [
    {
        test: /\.js$/,
        // include: [
        //   path.resolve(__dirname, "src"),
        //   path.resolve(__dirname, "spike"),
        //   path.resolve(__dirname, "driver")
        // ],
        exclude: /node_modules/,

        loader: "babel-loader",

        options: {
          presets: ["es2015"]
        },
        // options for the loader
      }
    ]
  },
  // resolveLoader: {
  //         modulesDirectories: [
  //             path.resolve(__dirname, "node_modules"),
  //                 ]
  // },
  // resolve: {
  //   // options for resolving module requests
  //   // (does not apply to resolving to loaders)

  //   root: [
  //     path.resolve(__dirname, "src"),
  //     path.resolve(__dirname, "spike"),
  //     path.resolve(__dirname, "driver"),
  //   ],
  //   // directories where to look for modules
  //   // moduleDirectories: ['node_modules'], 

  //   extensions: [".js", ".json", ".jsx"],
  //   // extensions that are used
  // },

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
