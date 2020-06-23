import { writable } from "svelte/store";

export const stats = writable({
  plays: 0,
  wins: 0,
  losses: 0,
  streak: 0,
});
export const parameters = writable({
  difficulty: "easy",
  numOfLights: 36,
});
