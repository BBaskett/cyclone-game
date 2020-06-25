import { writable } from "svelte/store";

export const stats = writable({
  plays: 0,
  wins: 0,
  losses: 0,
  streak: 0,
});
export const parameters = writable({
  difficulty: "Easy",
  numOfLights: 36,
});
export const _showSettings = writable(false);
export const _progress = writable(0);
export const _message = writable(null);
