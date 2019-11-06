import React, { useState, useEffect } from "react";
import useSocket from "./utils/useSocket";

const TextInput = ({
  className,
  onChange,
  ...props
}: Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type" | "onChange"
> & { onChange: (value: string) => void }) => (
  <div className="p-1">
    <input
      className={`border border-gray-500 inline-block ${className}`}
      type="text"
      onChange={({ target: { value } }) => onChange(value)}
      {...props}
    />
  </div>
);

const Button = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <div className="p-1">
    <button className={`bg-gray-300 border ${className}`} {...props} />
  </div>
);

const App = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [message, setMessage] = useState("Not connected");
  const [socket, setSocket] = useSocket();

  useEffect(() => {
    socket && socket.on("connect", () => setMessage("Connected"));
  }, [socket, setMessage]);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center">
        <TextInput className="w-32" onChange={setHost} /> Host
      </div>
      <div className="flex items-center">
        <TextInput className="w-32" onChange={setPort} /> Port
      </div>
      <Button className="w-32" onClick={() => setSocket(`${host}:${port}`)}>
        Connect
      </Button>
      {message}
    </div>
  );
};

export default App;
