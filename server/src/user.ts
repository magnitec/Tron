export type Team = "blue" | "orange";

export type User = {
  id: number;
  name: string;
  team: Team;
};

export const create = (name: string, team: Team) => ({
  id: 0,
  name,
  team
});

// throw new FetchError(400, 'User name already exists!');
