import React, { useState, useEffect } from "react";
import useSocket from "./utils/useSocket";
import cn from "classnames";

interface TextInputProps {
  className?: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const TextInput = ({
  className = "",
  onChange,
  readOnly,
  defaultValue = ""
}: TextInputProps) => {
  const [text, setText] = useState(defaultValue);

  return (
    <div className="border border-gray-500 inline-block">
      <input
        style={{ transition: "background-color 0.1s ease" }}
        className={cn("px-1", className, { "bg-gray-200": readOnly })}
        type="text"
        readOnly={readOnly}
        value={text}
        onChange={({ target: { value } }) => {
          setText(value);
          onChange(value);
        }}
      />
    </div>
  );
};

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
}

const Button = ({ className = "", ...props }: ButtonProps) => (
  <div className={`bg-gray-300 border ${className}`}>
    <button className={className} {...props} />
  </div>
);

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting";

const App = () => {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("8080");
  const [attempts, setAttempts] = useState(0);
  const [socket, setSocket] = useSocket();

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
    <div className="flex flex-col flex-grow">
      <div className="flex items-center p-1">
        <TextInput
          readOnly={status !== "idle"}
          defaultValue={host}
          onChange={setHost}
        />
        <div className="pl-1">Host</div>
      </div>
      <div className="flex items-center p-1">
        <TextInput
          readOnly={status !== "idle"}
          defaultValue={port}
          onChange={setPort}
        />
        <div className="pl-1">Port</div>
      </div>
      <div className="p-1">
        <Button
          className="w-32"
          onClick={() => (socket ? setSocket() : setSocket(`${host}:${port}`))}
        >
          {socket ? "disconnect" : "connect"}
        </Button>
      </div>
      <div className="p-1">{status}</div>
    </div>
  );
};

export default App;
