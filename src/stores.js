import { writable } from "svelte/store";

export const highScore = writable(0);
export const acceleration = writable(0);
export const parameters = writable({
  difficulty: "easy",
  numOfLights: 36,
});
