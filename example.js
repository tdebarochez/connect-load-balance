var connect = require('connect');
var balancer = require('./lib/connect-load-balance');

var backends = ['127.0.0.1:4000', '127.0.0.1:5000'];
connect.createServer(connect.cookieParser(),
                     connect.favicon(),
                     balancer({"backends": backends})).listen(3000);


connect.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('first backend');
}).listen(4000);
connect.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('second backend');
}).listen(5000);