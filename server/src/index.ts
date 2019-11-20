import { createServer, IncomingMessage, ServerResponse } from "http";
import * as Room from "./room";

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
  }
  return [404, ""];
};

createServer((request, response) => {
  const [httpCode, data] = route(request);

  response.writeHead(httpCode);
  response.write(JSON.stringify(data));
  response.end();
}).listen(port);
