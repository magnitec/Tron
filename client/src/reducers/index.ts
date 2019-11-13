import { createAction, DeriveActionType } from "./actions";

export interface State {
  host: string;
  port: string;
  rooms: string[];
  roomIndex: number | "none";
}

export const defaultState: State = {
  host: "localhost",
  port: "8080",
  rooms: [],
  roomIndex: "none"
};

export const actions = {
  setHost: (host: string) => createAction("SET_HOST", { host }),
  setPort: (port: string) => createAction("SET_PORT", { port }),
  addRoom: (room: string) => createAction("ADD_ROOM", { room }),
  setRoomIndex: (index: number | "none") =>
    createAction("SET_SELECTED", { index })
};

export type Action = DeriveActionType<typeof actions>;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_HOST":
      return { ...state, host: action.host };
    case "SET_PORT":
      return { ...state, port: action.port };
    case "SET_SELECTED":
      return { ...state, roomIndex: action.index };
    case "ADD_ROOM":
      return { ...state, rooms: [...state.rooms, action.room] };
  }
};
