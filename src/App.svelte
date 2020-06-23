<script>
  export let storageName, defaultValues;

  import { onMount } from "svelte";

  import Counter from "./components/Counter.svelte";
  import Cyclone from "./components/Cyclone.svelte";
  import Parameters from "./components/Parameters.svelte";
  import { parameters, stats } from "./stores.js";

  /* TODO
  - Add the ability to save and load saves instead of automatically backing up to storage
  - Speed up the game on every subsequent win
  */

  let lastVisit;

  function unloadHandler() {
    return window.localStorage.setItem(
      storageName,
      JSON.stringify({
        lastVisit: Date.now(),
        stats: $stats,
        parameters: $parameters
      })
    );
  }

  onMount(() => {
    if (window.localStorage.getItem(storageName) !== null) {
      const storage = JSON.parse(window.localStorage.getItem(storageName));
      $parameters = storage.parameters;
      $stats = storage.stats;
      lastVisit = new Date(storage.lastVisit).toDateString();
      return console.log("Session loaded from storage");
    }
  });
</script>

<style>
  /* main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: auto;
  }

  footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    color: hsl(0, 0%, 75%);
    text-align: center;
  } */

  header {
    padding: 1rem 1rem 0 1rem;
    margin-bottom: 1rem;
  }

  main {
    flex: 2 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  footer {
    padding: 0 1rem 1rem 1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  footer > p {
    font-size: 0.6rem;
  }
</style>

<svelte:window on:beforeunload={unloadHandler} />

<header>
  <Counter />
</header>
<main>
  <Cyclone />
</main>
<footer>
  <Parameters defaults={defaultValues} storage={storageName} />
  {#if lastVisit}
    <p>Last Visited {lastVisit}</p>
  {/if}
</footer>
