import { createServer, IncomingMessage, ServerResponse } from "http";
import * as Room from "./room";
import io from "socket.io";

const port: number = 8080;

type HttpResponse<A> = [number, A];

const handleCreateRoom = (): HttpResponse<{ id: string }> => {
  const room = Room.create();
  return [200, { id: room.id }];
};

const route = (request: IncomingMessage): HttpResponse<unknown> => {
  switch (request.method) {
    case "POST": {
      switch (request.url) {
        case "/rooms":
          return handleCreateRoom();
      }
    }
    case "OPTIONS": {
      return [200, ""];
    }
  }
  return [404, ""];
};

const setCorsHeaders = (response: ServerResponse) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Method", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  response.setHeader("Access-Control-Allow-Headers", "*");
};

const http = createServer((request, response) => {
  setCorsHeaders(response);
  const [httpCode, data] = route(request);

  response.writeHead(httpCode);
  response.write(JSON.stringify(data));
  response.end();
});

io(http).on("connection", socket => {
  console.log("socket connection on", socket);
});

http.listen(port);
