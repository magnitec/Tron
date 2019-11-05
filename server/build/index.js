"use strict";
var http = require('http');
var fs = require('fs');
var webSocketServer = require('websocket').server;
var sessions = 0; // change it to actual data
var dummy;
var server = http.createServer(function (request, response) {
    sessions++;
    console.log(sessions);
}).listen(1337, function () {
    console.log('listening BBc...');
});
var wsServer = new webSocketServer({
    httpServer: server
});
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    //  handle requests from users here.
    connection.on('request', function (request) {
        console.log('received request');
    });
    connection.on('close', function (connection) {
        // close user connection
    });
});
//# sourceMappingURL=index.js.map