import React, { useState, useEffect } from "react";
import useSocket from "./utils/useSocket";
import cn from "classnames";

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting";

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
  disabled?: boolean;
  onClick: () => void;
}

const Button = ({
  className = "",
  disabled = false,
  ...props
}: ButtonProps) => {
  const enabledStyle = "hover:bg-blue-200 bg-gray-300 border-black";
  const disabledStyle =
    "cursor-not-allowed bg-gray-500 text-gray-600 border-white";
  return (
    <div className={className}>
      <button
        disabled={disabled}
        className={cn(
          "w-full border h-full",
          disabled ? disabledStyle : enabledStyle
        )}
        {...props}
      />
    </div>
  );
};

interface RoomListProps {
  rooms: string[];
  selected: number;
  setSelected: (s: number) => void;
  setRooms: (rs: string[]) => void;
}

const RoomList = ({
  rooms,
  selected,
  setSelected,
  setRooms
}: RoomListProps) => (
  <div className="flex flex-col">
    <div className="px-1 pt-1">
      <div className="border w-32 h-16 overflow-auto">
        {rooms.map((r, i) => {
          const isSelected = selected === i;
          return (
            <div
              className={isSelected ? "bg-blue-200" : "hover:bg-blue-300"}
              onClick={() => (isSelected ? setSelected(-1) : setSelected(i))}
            >
              {r}
            </div>
          );
        })}
      </div>
    </div>
    <Button
      className="w-full p-1"
      onClick={() => {
        setRooms([...rooms, "Room"]);
      }}
    >
      {"Add room"}
    </Button>
  </div>
);

const App = () => {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("8080");
  const [rooms, setRooms] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [selected, setSelected] = useState(-1);
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
      <RoomList {...{ rooms, selected, setSelected, setRooms }} />
      <div className="flex flex-col">
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

        <div className="flex">
          <Button
            className="w-32 p-1"
            disabled={selected < 0}
            onClick={() =>
              socket ? setSocket(null) : setSocket(`${host}:${port}`)
            }
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
