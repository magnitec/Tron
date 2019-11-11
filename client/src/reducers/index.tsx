interface EmptyAction<T extends string> {
  type: T;
}

type ActionPayload = Omit<{}, "type">;

type FilledAction<T extends string, P extends Omit<{}, "type">> = EmptyAction<
  T
> &
  P;

type ActionUnion<
  A extends { [key: string]: (...args: any[]) => any }
> = ReturnType<A[keyof A]>;

type CreateAction = {
  <T extends string>(type: T): EmptyAction<T>;
  <T extends string, P extends ActionPayload>(
    type: T,
    payload: P
  ): FilledAction<T, P>;
};

const createAction: CreateAction = <T extends string, P extends ActionPayload>(
  type: T,
  payload?: P
): EmptyAction<T> | FilledAction<T, P> =>
  payload === undefined ? { type } : { type, ...payload };

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

export type Action = ActionUnion<typeof actions>;

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
