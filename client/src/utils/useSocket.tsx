import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = (): [SocketIOClient.Socket | null, (uri: string) => void] => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  useEffect(() => {
    return () => {
      if (socket == null) return;
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);
  return [socket, uri => setSocket(io(uri))];
};

export default useSocket;
