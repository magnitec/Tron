import React, { useState, useEffect, useReducer } from "react";
import useSocket from "./utils/useSocket";
import { Button, TextInput } from "./components";
import { reducer, defaultState, actions as A } from "./reducers";

const App = () => {
  const [{ name, host, port, status, roomID }, dispatch] = useReducer(
    reducer,
    defaultState
  );

  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useSocket(null);
  const rootURL = `http://${host}:${port}`;

  useEffect(() => {
    if (status !== "connecting") return;
    let cancel: (() => void) | null;

    new Promise(async resolve => {
      cancel = () => resolve();
      try {
        const response = await fetch(`${rootURL}/rooms`, { method: "POST" });
        const { id } = await response.json();
        dispatch(A.setJoining(id));
      } catch (e) {
        cancel = null;
        setError(JSON.stringify(e.message));
        dispatch(A.setStatus("idle"));
      }
    });

    return () => {
      if (cancel !== null) cancel();
    };
  }, [status, rootURL]);

  useEffect(() => {
    if (status !== "connecting" || error === null) return;
    setError(null);
  }, [status, error]);

  useEffect(() => {
    if (status !== "idle") return;
    if (socket !== null) setSocket(null);
  });

  useEffect(() => {
    if (roomID === null) return;
    dispatch(A.setStatus("joining"));
    setSocket(`${rootURL}/rooms/${roomID}`, { query: { player: name } });
  }, [rootURL, roomID, name, setSocket]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("connect", () => dispatch(A.setStatus("connected")));
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("connect_error", () => setAttempts(attempts + 1));
  }, [socket, attempts]);

  return (
    <div className="flex">
      <div className="flex flex-col">
        <div className="flex items-center p-1">
          <TextInput
            readOnly={status !== "idle"}
            defaultValue={name}
            onChange={name => dispatch(A.setName(name))}
          />
          <div className="pl-1">Host</div>
        </div>
        <div className="flex items-center p-1">
          <TextInput
            readOnly={status !== "idle"}
            defaultValue={host}
            onChange={host => dispatch(A.setHost(host))}
          />
          <div className="pl-1">Host</div>
        </div>
        <div className="flex items-center p-1">
          <TextInput
            readOnly={status !== "idle"}
            defaultValue={port}
            onChange={port => dispatch(A.setPort(port))}
          />
          <div className="pl-1">Port</div>
        </div>

        <div className="flex">
          <Button
            className="w-32 p-1"
            onClick={() =>
              dispatch(A.setStatus(status === "idle" ? "connecting" : "idle"))
            }
          >
            {status === "idle" ? "Connect" : "Disconnect"}
          </Button>
          <div className="p-1">{status}</div>
          <div className="p-1">{roomID}</div>
        </div>
        <div className="p-1 text-red-400">{error}</div>
      </div>
    </div>
  );
};

export default App;
