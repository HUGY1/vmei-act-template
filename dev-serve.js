const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  // contentBase: 'path.join(__dirname, "src")',
  hot: true,
  host: 'localhost',
  port: 8081,
  proxy:{
    '/*': {
      target: 'http://127.0.0.1:8102/',
      changeOrigin: true
    }
  }
 
 
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(8081, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
