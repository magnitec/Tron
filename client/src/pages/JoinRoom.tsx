import React, { useState, useEffect } from "react";
import useSocket from "../utils/useSocket";
import { State, Action } from "../reducers";
import { useRouteMatch } from "react-router";

type JoinRoomProps = {
  store: [State, (a: Action) => void];
};

type Status = "idle" | "joining" | "joined";

export const JoinRoom = ({
  store: [{ name, host, port }, dispatch]
}: JoinRoomProps) => {
  const match = useRouteMatch<{ roomID: string }>();
  const roomID = match?.params?.roomID;

  const [message, setMessage] = useState<string>(
    "I seem to not have received anything"
  );
  const [status, setStatus] = useState<Status>("idle");
  const [attempts, setAttempts] = useState(0);
  const [socket, setSocket] = useSocket(null);
  const rootURL = `http://${host}:${port}`;

  useEffect(() => {
    if (status !== "idle") return;
    if (socket !== null) setSocket(null);
  });

  useEffect(() => {
    if (roomID === null) return;
    setSocket(`${rootURL}/rooms/${roomID}`, { query: { player: name } });
    setStatus("joining");
  }, [rootURL, roomID, name, setSocket, dispatch]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("connect", () => setStatus("joined"));
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("connect_error", () => setAttempts(attempts + 1));
  }, [socket, attempts]);

  useEffect(() => {
    if (status !== "joined" || socket === null) return;
    socket.on("message", (m: string) => setMessage(m));
  }, [socket, status]);

  return (
    <div>
      <div>{`${rootURL}/${roomID}`}</div>
      <div>{message}</div>
    </div>
  );
};
