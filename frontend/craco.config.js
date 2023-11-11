const path = require('path');

module.exports = {
  webpack: {
    test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
    include: [Path.join(__dirname, "src/assets")],
    loader: "file-loader?name=assets/[name].[ext]",
    alias: {
      "@pages": path.resolve(__dirname, 'pages/')
    }
  }
};