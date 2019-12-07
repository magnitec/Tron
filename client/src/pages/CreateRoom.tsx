import React, { useState, useEffect } from "react";
import { Button, TextInput } from "../components";
import { State, Action, actions as A } from "../reducers";
import { useRouteMatch, useHistory } from "react-router";

type CreateRoomProps = {
  store: [State, (a: Action) => void];
};

type Status = "idle" | "create" | "creating" | "created" | "error";

export const CreateRoom = ({ store: [state, dispatch] }: CreateRoomProps) => {
  const match = useRouteMatch({ path: "/", exact: true });

  const history = useHistory();

  const { name, host, port, error } = state;
  const [roomID, setRoomID] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const rootURL = `http://${host}:${port}`;

  useEffect(() => {
    if (status !== "create") return;
    let cancel: (() => void) | null;

    new Promise(async resolve => {
      cancel = () => resolve();
      try {
        const response = await fetch(`${rootURL}/rooms`, { method: "POST" });
        const { id } = await response.json();
        setRoomID(id);
        setStatus("created");
      } catch (e) {
        cancel = null;
        dispatch(A.setError(JSON.stringify(e.message)));
        setStatus("error");
      }
    });

    setStatus("creating");

    return () => {
      if (cancel !== null) cancel();
    };
  }, [status, rootURL, dispatch]);

  useEffect(() => {
    if (status !== "error") return;
    setStatus("idle");
  }, [status]);

  return (
    match && (
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
            {status !== "created" ? (
              <Button
                disabled={status !== "idle"}
                className="w-32 p-1"
                onClick={() => setStatus("create")}
              >
                Connect
              </Button>
            ) : (
              <Button
                className="w-32 p-1"
                onClick={() => history.push(`/${roomID}`)}
              >
                Join
              </Button>
            )}

            <div className="p-1">{status}</div>
            <div className="p-1">{roomID && `${rootURL}/${roomID}`}</div>
          </div>
          <div className="p-1 text-red-400">{error}</div>
        </div>
      </div>
    )
  );
};
