import React from "react";
import { Button } from "./Button";
import { Action, actions } from "../reducers";

interface RoomListProps {
  rooms: string[];
  roomIndex: number | "none";
  dispatch: React.Dispatch<Action>;
}

export const RoomList = ({ rooms, roomIndex, dispatch }: RoomListProps) => (
  <div className="flex flex-col">
    <div className="px-1 pt-1">
      <div className="border w-32 h-16 overflow-auto">
        {rooms.map((r, i) => {
          const isSelected = roomIndex === i;
          return (
            <div
              className={isSelected ? "bg-blue-200" : "hover:bg-blue-300"}
              onClick={() =>
                dispatch(actions.setRoomIndex(isSelected ? "none" : i))
              }
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
        dispatch(actions.addRoom("Room"));
      }}
    >
      Add room
    </Button>
  </div>
);
