import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    storageName: "light_cyclone",
    defaultParameters: {
      difficulty: "easy",
      numOfLights: 36,
    },
  },
});

export default app;
