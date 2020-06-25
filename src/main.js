import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    storageName: "light_cyclone",
    defaultValues: {
      parameters: {
        difficulty: "Easy",
        numOfLights: 36,
      },
      stats: {
        plays: 0,
        wins: 0,
        losses: 0,
        streak: 0,
      },
    },
  },
});

export default app;
