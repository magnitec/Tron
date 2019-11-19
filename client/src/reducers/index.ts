import { createAction, DeriveActionType } from "./actions";

type ConnectionStatus =
  | "idle"
  | "connecting"
  | "joining"
  | "connected"
  | "reconnecting";

export interface State {
  host: string;
  port: string;
  status: ConnectionStatus;
  roomID: string | null;
}

export const defaultState: State = {
  host: "localhost",
  port: "8080",
  status: "idle",
  roomID: null
};

export const actions = {
  setHost: (host: string) => createAction("SET_HOST", { host }),
  setPort: (port: string) => createAction("SET_PORT", { port }),
  setStatus: (status: ConnectionStatus) =>
    createAction("SET_STATUS", { status }),
  setRoomID: (roomID: string) => createAction("SET_ROOM_ID", { roomID })
};

export type Action = DeriveActionType<typeof actions>;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_HOST":
      return { ...state, host: action.host };
    case "SET_PORT":
      return { ...state, port: action.port };
    case "SET_ROOM_ID":
      return { ...state, roomID: action.roomID };
    case "SET_STATUS":
      return { ...state, status: action.status };
  }
};
