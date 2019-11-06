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
        className={className}
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

const App = () => {
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("8080");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("Not connected");
  const [socket, setSocket] = useSocket();

  useEffect(() => {
    return () => setAttempts(0);
  }, [socket]);

  useEffect(() => {
    socket && socket.on("connect", () => setMessage("Connected"));
  }, [socket]);

  useEffect(() => {
    socket && socket.on("connect_error", () => setAttempts(attempts + 1));
  }, [socket, attempts]);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center p-1">
        <TextInput
          readOnly={!!socket}
          defaultValue={host}
          className={cn("w-32 px-1", { "bg-gray-200": !!socket })}
          onChange={setHost}
        />
        <div className="pl-1">Host</div>
      </div>
      <div className="flex items-center p-1">
        <TextInput
          readOnly={!!socket}
          defaultValue={port}
          className={cn("w-32 px-1", { "bg-gray-200": !!socket })}
          onChange={setPort}
        />
        <div className="pl-1">Port</div>
      </div>
      <div className="p-1">
        <Button
          className="w-32"
          onClick={() => (socket ? setSocket() : setSocket(`${host}:${port}`))}
        >
          {socket ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <div className="p-1">{message}</div>
      <div
        className={`p-1 ${attempts === 0 ? "text-gray-300" : "text-red-500"}`}
        style={{ transition: "color 1s ease" }}
      >{`Attempts ${attempts}`}</div>
    </div>
  );
};

export default App;
