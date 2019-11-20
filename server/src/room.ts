import uuidv4 from "uuid/v4";
import { User } from "./user";

export type Room = {
  id: string;
  users: { [key: string]: User };
};

export const join = (user: User, room: Room): Room => {
  const users = room.users;
  if (Object.keys(users).length >= 2) {
    throw Error("User limit reached!");
  }

  if (users[user.name]) {
    throw Error("User name already exists!");
  }

  return { ...room, users: { ...users, [user.name]: user } };
};

export const create = (): Room => ({
  id: uuidv4(),
  users: {}
});
