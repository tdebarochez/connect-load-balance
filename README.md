Connect-load-balance
====================

Connect-cache is a middleware for Connect framework. It provide an HTTP proxy
for many servers in backend. You just have to provide web servers IPs or domain
name.

Usage
-----

    var connect_load_balance = require('connect-load-balance'),
        connect = require('connect');
    var ips = ['web1.example.com', 'web2.example.com:8080'];
    var server = connect.createServer(
      connect.cookieParser(),
      connect_load_balance({backends: ips})
    );

First note : you must call cookieParser middleware before load balancer, because the
proxy set a session cookie to client.
Second note : this middleware must be the last called.

Installation
------------

    $ npm install connect-load-balance

