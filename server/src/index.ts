import { request, createServer, IncomingMessage, ServerResponse } from "http";
import * as User from "./user";
import * as Room from "./room";

// const webSocketServer = require('websocket').server;
// const webSocketServer = require("ws");
import io from "socket.io";

const rooms: {
  [key: string]: Room.Room | undefined;
} = {};

const handlerNotFound = (url: string): [number, unknown] => {
  return [404, `Cannot find ${url}`];
};

type RequestCreateRoom = {
  roomName: string;
};

const handlerCreateRoom = ({
  roomName
}: RequestCreateRoom): [number, unknown] => {
  const room = Room.create(roomName);

  if (rooms[room.name]) {
    return [409, "Room already exists"];
  }

  rooms[room.name] = room;
  return [200, { password: room.password }];
};

type RequestJoinRoom = {
  roomName: string;
  userName: string;
  password: string;
};

const handlerJoinRoom = ({
  roomName,
  userName,
  password
}: RequestJoinRoom): [number, unknown] => {
  const room = rooms[roomName];

  if (!room) {
    console.log(`Room ${roomName} doesn't exist`);
    return [404, "Room not found"];
  }

  if (room.password !== password) {
    console.log("Incorrect password");
    return [401, `Incorrect password to ${room.name}`];
  }

  if (room.users[userName]) {
    return [409, `User already joined ${room.name}`];
  }

  const user = User.create(userName, "blue"); // blue red?
  rooms[roomName] = Room.join(user, room);
  console.log(`user: ${user.name} joined room: ${room.name}`);
  console.log(`room status ${room}`);
  return [201, ""];
};

const receiveBody = async (request: IncomingMessage): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const buffer: Buffer[] = [];
    request.on("data", (chunk: Buffer) => {
      buffer.push(chunk);
    });
    request.on("end", () => {
      resolve(Buffer.concat(buffer).toString());
    });
    request.on("error", err => {
      reject(err);
    });
  });

const router = async (request: IncomingMessage): Promise<[number, unknown]> => {
  switch (request.method) {
    case "POST": {
      const body = await receiveBody(request);
      const data: unknown = JSON.parse(body);

      if (typeof data !== "object" || !data) {
        return [400, "Body is not a valid JSON object"];
      }

      switch (request.url) {
        case "/create":
          return handlerCreateRoom({ roomName: "", ...data });
        case "/join":
          return handlerJoinRoom({
            roomName: "",
            userName: "",
            password: "",
            ...data
          });
      }
    }
    case "GET":
    case "PUT":
    case "PATCH":
    case "DELETE":
  }

  return handlerNotFound(request.url || "-");
};

createServer(async (request: IncomingMessage, response: ServerResponse) => {
  const [httpCode, responseBody] = await router(request);
  response.writeHead(httpCode);
  response.write(responseBody);
  response.end();
}).listen(3000, () => {
  console.log("listening for requests...");
});

//

// const wss = new WebSocket.Server({ port: 8080 })

// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//   })
//   ws.send('ho!')
// })

// //

// console.log('connect to websocket (not implemented)');

// const wsServer: any = new webSocketServer({
//     httpServer: wsServer
// });

// wsServer.on('request', (request: any) => {
//     console.log('New websocket connection from origin ' + request.origin + '.');
//     const connection = request.accept(null, request.origin);
//     console.log('ws on request', connection);
// });

// wsServer.on('message', (data: any, id: any) => {
//     var mes = wsServer.unmaskMessage(data);
//     var str = wsServer.convertToString(mes.message);
//     console.log('ws on message', str);
// });
