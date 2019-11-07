import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = (
  uri: string | null
): [SocketIOClient.Socket | null, (uri: string | null) => void] => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(
    uri !== null ? io(uri) : null
  );
  useEffect(() => {
    return () => {
      if (socket == null) return;
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);
  return [socket, uri => setSocket(uri !== null ? io(uri) : null)];
};

export default useSocket;
