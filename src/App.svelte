<script>
  export let storageName, defaultParameters;

  import { onMount } from "svelte";

  import Counter from "./components/Counter.svelte";
  import Cyclone from "./components/Cyclone.svelte";
  import Parameters from "./components/Parameters.svelte";
  import { acceleration, highScore, parameters } from "./stores.js";

  /* TODO
  - Add the ability to save and load saves instead of automatically backing up to storage
  - Use JS to produce the CSS for the lights around the circle
  - Create global styles for buttons and such
  - Add metrics for: total plays, total wins, win percentage
  - Speed up the game on every subsequent win
  - Adjust siing of the cyclone to be responsive
  - Stop button needs to interject the interval so that it stops immediately
  */

  let lastVisit;

  function unloadHandler() {
    return window.localStorage.setItem(
      storageName,
      JSON.stringify({
        lastVisit: Date.now(),
        highScore: $highScore,
        parameters: $parameters
      })
    );
  }

  onMount(() => {
    if (window.localStorage.getItem(storageName) !== null) {
      const storage = JSON.parse(window.localStorage.getItem(storageName));
      $parameters = storage.parameters;
      $highScore = storage.highScore;
      lastVisit = new Date(storage.lastVisit).toDateString();
      return console.log("Session loaded from storage");
    }
  });
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    text-align: center;
    color: hsl(0, 0%, 75%);
  }
</style>

<svelte:window on:beforeunload={unloadHandler} />

<header>
  <Counter />
  <Parameters defaults={defaultParameters} storage={storageName} />
</header>
<main>
  <Cyclone />
</main>
<footer>
  {#if lastVisit}
    <h6>Last Visited {lastVisit}</h6>
  {/if}
</footer>
