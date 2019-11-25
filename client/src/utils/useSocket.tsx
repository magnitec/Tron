import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

type SocketSetter = {
  (uri: null): void;
  (uri: string, roomID: string): void;
};

const useSocket = (
  uri: string | null
): [SocketIOClient.Socket | null, SocketSetter] => {
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

  const setter = useCallback(
    (uri: string | null, roomID?: string) =>
      setSocket(
        uri !== null
          ? io(uri, {
              query: {
                roomID
              }
            })
          : null
      ),
    []
  );

  return [socket, setter];
};

export default useSocket;
