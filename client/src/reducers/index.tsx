export interface State {
  host: string;
  port: string;
  rooms: string[];
  selected: number;
}

export const defaultState: State = {
  host: "localhost",
  port: "8080",
  rooms: [],
  selected: -1
};

export type Action =
  | { type: "SET_HOST"; host: string }
  | { type: "SET_PORT"; port: string }
  | { type: "ADD_ROOM"; room: string }
  | { type: "SET_SELECTED"; selected: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_HOST":
      return { ...state, host: action.host };
    case "SET_PORT":
      return { ...state, port: action.port };
    case "SET_SELECTED":
      return { ...state, selected: action.selected };
    case "ADD_ROOM":
      return { ...state, rooms: [...state.rooms, action.room] };
  }
};
