import React, { useState, useEffect } from "react";
import useSocket from "./utils/useSocket";

interface TextInputProps {
  className?: string;
  onChange: (value: string) => void;
}

const TextInput = ({ className, onChange }: TextInputProps) => (
  <div className="p-1">
    <input
      className={`border border-gray-500 inline-block ${className}`}
      type="text"
      onChange={({ target: { value } }) => onChange(value)}
    />
  </div>
);

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
}

const Button = ({ className, ...props }: ButtonProps) => (
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
  }, [socket]);

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
