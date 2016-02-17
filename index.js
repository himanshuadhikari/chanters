var express = require('express');
var app = express();
var route = require("./server/route.js")(app, express);
var util = require('util');

var userDao = require("./server/userDao.js");

// console.log("userDao", userDao);
// console.log("server route", route);

// app.get('/', route);

var port = process.env.PORT || 4443;

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
    console.log('Example app listening at  http://localhost:%s', port);
});
