<script>
  export let storageName, defaultValues;

  import { onMount } from "svelte";
  import Counter from "./components/Counter.svelte";
  import Cyclone from "./components/Cyclone.svelte";
  import Modal from "./components/Modal.svelte";
  import Parameters from "./components/Parameters.svelte";
  import { parameters, stats, _showSettings } from "./stores.js";

  let lastVisit;
  let settings = false;
  let orientation = window.screen.orientation;

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
  header {
    padding: 1rem;
    display: block;
  }

  p {
    text-align: center;
  }
  main {
    flex: 2 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  footer {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: hsl(0, 0%, 95%);
  }
</style>

<svelte:window on:beforeunload={unloadHandler} />

<header>
  <Counter />
  <p>Stop the red light on the gold light to win!</p>
</header>
<main>
  <Cyclone />
</main>
<footer>
  <button class="text-button" on:click={() => ($_showSettings = true)}>
    Settings
  </button>
</footer>
<Parameters defaults={defaultValues} storage={storageName} {lastVisit} />
<Modal />
