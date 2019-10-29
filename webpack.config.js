const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const extPath = "./src/extension"
const distPath = "./dist/extension"

const staticFiles = [
  "manifest.json",
  "devtools.html",
  "panel.html",
  "icons",
];

const extension = {
  entry: {
    background: `${extPath}/background.js`,
    content: `${extPath}/content.js`,
    devtools: `${extPath}/devtools.js`,
    panel: `${extPath}/panel.js`,
  },

  mode: "development",
  devtool: "cheap-source-map",

  output: {
    filename: "./[name].js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, distPath)
  },

  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        loader: "babel-loader",
        query: {
          presets: [
            "@babel/preset-react",
            "@babel/preset-env"
          ]
        },
      }
    ],
  },

  plugins: [
    new CopyPlugin(
      staticFiles.map((filename) => ({
        from: `${extPath}/${filename}`,
        to: filename,
      })).concat([{
        from: "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
        to: "browser-polyfill.min.js"
      }])
    ),
  ],

  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx', '.mjs' ]
  },
}

module.exports = [
  extension,
]
