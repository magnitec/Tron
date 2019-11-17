import { User } from "./user";

export type Room = {
  name: string;
  password: string;
  users: { [key: string]: User };
};

const generatePassword = (): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return [...Array(5)]
    .map(() => charset.charAt(Math.random() * charset.length))
    .join("");
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

export const create = (roomName: string): Room => ({
  name: roomName,
  password: generatePassword(),
  users: {}
});
