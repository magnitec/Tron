import { createAction, DeriveActionType } from "./actions";

type ConnectionStatus =
  | "idle"
  | "connecting"
  | "joining"
  | "connected"
  | "reconnecting";

export type State = {
  name: string;
  host: string;
  port: string;
  status: ConnectionStatus;
  roomID: string | null;
  error: string | null;
};

export const defaultState: State = {
  name: "pato",
  host: "localhost",
  port: "8080",
  status: "idle",
  roomID: null,
  error: null
};

export const actions = {
  setHost: (host: string) => createAction("SET_HOST", { host }),
  setError: (err: string | null) => createAction("SET_ERROR", { err }),
  setPort: (port: string) => createAction("SET_PORT", { port }),
  setStatus: (status: ConnectionStatus) =>
    createAction("SET_STATUS", { status }),
  setJoining: (roomID: string) => createAction("SET_JOINING", { roomID }),
  setRoomID: (roomID: string) => createAction("SET_ROOM_ID", { roomID }),
  setName: (name: string) => createAction("SET_NAME", { name })
};

export type Action = DeriveActionType<typeof actions>;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.name };
    case "SET_HOST":
      return { ...state, host: action.host };
    case "SET_PORT":
      return { ...state, port: action.port };
    case "SET_ROOM_ID":
      return { ...state, roomID: action.roomID };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_JOINING":
      return { ...state, status: "joining", roomID: action.roomID };
    case "SET_ERROR":
      return { ...state, status: "idle", error: action.err };
  }
};
