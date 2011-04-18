var connect = require('connect');
var balancer = require('./lib/connect-load-balance');

var backends = ['127.0.0.1:4000', '127.0.0.1:5000'];
var server = connect.createServer(connect.cookieParser(),
                                  connect.favicon(),
                                  balancer({"backends": backends}));
server.listen(3000);
server.maxConnections = 10;

connect.createServer(function (req, res) {
  if (req.url == '/error') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }
  else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('first backend');
  }
}).listen(4000);
connect.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('second backend');
}).listen(5000);
