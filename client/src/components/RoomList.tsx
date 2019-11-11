import React from "react";
import { Button } from "./Button";
import { Action } from "../reducers";

interface RoomListProps {
  rooms: string[];
  selected: number;
  dispatch: React.Dispatch<Action>;
}

export const RoomList = ({ rooms, selected, dispatch }: RoomListProps) => {
  const setSelected = (selected: number) =>
    dispatch({ type: "SET_SELECTED", selected });
  const addRoom = (room: string) => dispatch({ type: "ADD_ROOM", room });
  return (
    <div className="flex flex-col">
      <div className="px-1 pt-1">
        <div className="border w-32 h-16 overflow-auto">
          {rooms.map((r, i) => {
            const isSelected = selected === i;
            return (
              <div
                className={isSelected ? "bg-blue-200" : "hover:bg-blue-300"}
                onClick={() => (isSelected ? setSelected(-1) : setSelected(i))}
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
          addRoom("Room");
        }}
      >
        {"Add room"}
      </Button>
    </div>
  );
};
