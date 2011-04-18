
var utils = require('connect').utils,
    http  = require('http');

var backends = [],
    index = -1,
    cookies_options = {path : '/',
                       httpOnly : true};

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
    if (!('cookies' in req)) {
      throw "you must call cookieParser middleware before load balancer";
    }
    var backend_id;
    if (!('b' in req.cookies)
      || req.cookies.b < 0
      || req.cookies.b >= backends.length) {
      backend_id = ++index >= backends.length ? 0 : index;
      res.setHeader('set-cookie', utils.serializeCookie('b', backend_id, cookies_options));
    }
    else {
      backend_id = req.cookies.b;
    }

    /*
     * Proxy 
     */
    var tmp = backends[backend_id].split(':')
      , backend_host = tmp[0]
      ,  backend_port = tmp.length > 1 ? tmp[1] : 80
      ,  client = http.createClient(backend_port, backend_host)
      ,  request = client.request(req.method, req.url, req.headers);
    req.pipe(request);
    request.on('response', function (response) {
      res.writeHead(response.statusCode, response.headers);
      if (response.statusCode === 204
          || response.statusCode === 304
          || (100 <= response.statusCode
              && response.statusCode <= 199)) {
        return res.end();
      }
      response.pipe(res);
    });
  };
};
