
var utils = require('connect').utils,
    http  = require('http');

var backends = [], index = -1;

exports = module.exports = function (options) {
  options = options || {};
  if (!('backends' in options)
      ||!('length' in options.backends)
      || options.backends.length < 0) {
    throw "you must provide backends";
  }
  backends = options.backends;
  return function (req, res) {

    /*
     * Balancing
     */
    if (index >= backends.length) {
      index = -1;
    }
    var backend_id;
    if (!('b' in req.cookies)
      || req.cookies.b < 0
      || req.cookies.b >= backends.length) {
      backend_id = ++index >= backends.length ? 0 : index;
      res.setHeader('set-cookie', ['b=' + backend_id]);
    }
    else {
      backend_id = req.cookies.b;
    }

    /*
     * Proxy 
     */
    var tmp = backends[backend_id].split(':'),
        backend_host = tmp[0],
        backend_port = tmp.length > 1 ? tmp[1] : 80,
        client = http.createClient(backend_port, backend_host),
        request = client.request(req.method, req.url, req.headers);
    if (req.body !== undefined && req.body.length > 0) {
      request.write(req.body, 'binary');
    }
    request.end();
    request.on('response', function (response) {
      res.statusCode = response.statusCode;
      res.headers = response.headers;
      response.setEncoding('binary');
      response.pipe(res);
      response.on('end', function () {
        // next();
      });
    });
  };
};