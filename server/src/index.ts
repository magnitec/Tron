const http = require('http');
const fs = require('fs');
const webSocketServer = require('websocket').server;

let sessions: number = 0; // change it to actual data
let dummy;

const server = http.createServer((request: any, response: any) => {
  sessions++;
  console.log(sessions);
}).listen(1337, () => {
    console.log('listening BBc...');
});

const wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', (request: any) => {
    const connection = request.accept(null, request.origin);
  
    //  handle requests from users here.
    connection.on('request', (request: any) => {
      console.log('received request');
    });
  
    connection.on('close', (connection: any) => {
      // close user connection
    });
  });