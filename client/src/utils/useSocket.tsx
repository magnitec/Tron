import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

type SocketSetter = {
  (uri: null): void;
  (uri: string, options?: SocketIOClient.ConnectOpts): void;
};

const useSocket = (
  uri: string | null, options?: SocketIOClient.ConnectOpts
): [SocketIOClient.Socket | null, SocketSetter] => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(
    uri !== null ? io(uri, options) : null
  );
  useEffect(() => {
    return () => {
      if (socket == null) return;
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);

  const setter = useCallback(
    (uri: string | null, options?: SocketIOClient.ConnectOpts) => setSocket(uri !== null ? io(uri, options) : null),
    []
  );

  return [socket, setter];
};

export default useSocket;
