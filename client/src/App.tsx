import React, { useState, useEffect, useReducer } from "react";
import useSocket from "./utils/useSocket";
import { Button, TextInput, RoomList } from "./components";
import { reducer, defaultState, actions } from "./reducers";

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting";

const App = () => {
  const [{ host, port, roomIndex, rooms }, dispatch] = useReducer(
    reducer,
    defaultState
  );
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const [socket, setSocket] = useSocket(null);

  useEffect(() => {
    if (socket === null) return;
    setStatus("connecting");
    socket.on("connect", () => setStatus("connected"));

    return () => setStatus("idle");
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("connect_error", () => setAttempts(attempts + 1));
  }, [socket, attempts]);

  return (
    <div className="flex">
      <RoomList {...{ rooms, roomIndex, dispatch }} />
      <div className="flex flex-col">
        <div className="flex items-center p-1">
          <TextInput
            readOnly={status !== "idle"}
            defaultValue={host}
            onChange={host => dispatch(actions.setHost(host))}
          />
          <div className="pl-1">Host</div>
        </div>
        <div className="flex items-center p-1">
          <TextInput
            readOnly={status !== "idle"}
            defaultValue={port}
            onChange={port => dispatch(actions.setPort(port))}
          />
          <div className="pl-1">Port</div>
        </div>

        <div className="flex">
          <Button
            className="w-32 p-1"
            disabled={roomIndex === "none"}
            onClick={() => setSocket(socket ? null : `${host}:${port}`)}
          >
            {socket ? "Disconnect" : "Connect"}
          </Button>
          <div className="p-1">{status}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
