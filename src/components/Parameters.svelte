<script>
  export let defaults, storage;

  import { afterUpdate, beforeUpdate } from "svelte";
  import { slide, fly } from "svelte/transition";
  import { backInOut } from "svelte/easing";
  import { parameters, stats } from "../stores.js";

  let display = false;

  function resetScores() {
    if (window.confirm("Are you sure you want to reset the scores?")) {
      $stats = defaults.stats;
      updateStorage();
    }
  }

  function resetDefault() {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to their default values?"
      )
    ) {
      $parameters = defaults.parameters;
      updateStorage();
    }
  }

  function updateStorage() {
    window.localStorage.setItem(
      storage,
      JSON.stringify({
        lastVisit: Date.now(),
        stats: $stats,
        parameters: $parameters
      })
    );
    display = !display;
    return window.location.reload(false);
  }

  // No need for keypress validation
  /* function validateKeypress(event) {
    if (
      !event.code.includes("Digit") ||
      (event.key + event.target.value).length > 2 ||
      (event.target.value.length === 0 &&
        (event.key > 3 || event.key === "0")) ||
      (event.target.value.length > 0 &&
        event.target.value[0] === "3" &&
        event.key > 6)
    ) {
      return event.preventDefault();
    }
  } */
</script>

<style>
  form {
    position: absolute;
    background-color: hsl(0, 0%, 100%);
    top: 0;
    left: 0;
    width: 50vw;
    min-width: 275px;
    height: 100vh;
    padding: 2rem;
    box-shadow: 0.5rem 0 1rem 0 hsla(0, 0%, 65%, 0.35);
    border-right: 1px solid hsl(0, 0%, 65%);
    z-index: 100;
  }

  fieldset {
    border: 1px solid hsl(0, 0%, 65%);
    border-radius: 0.35rem;
    padding: 0.5rem;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
      to bottom,
      hsl(0, 0%, 95%),
      hsl(0, 0%, 100%),
      hsl(0, 0%, 95%)
    );
    box-shadow: inset 0 0 0.75rem 0 rgba(200, 200, 200, 0.35);
  }

  fieldset > label {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  fieldset > *:not(label) {
    margin: auto;
  }

  button + button {
    margin: 0.5rem auto 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    position: relative;
    cursor: pointer;
    flex: 0 0 auto;
    margin: auto;
  }

  a::after {
    content: "";
    width: 0%;
    height: 1px;
    background-color: black;
    display: block;
    position: absolute;
    transition: 0.25s ease;
  }

  a:hover::after {
    width: 100%;
  }

  #close {
    cursor: pointer;
    font-weight: 700;
    text-align: right;
    margin-bottom: 1rem;
  }
</style>

<a on:click={() => (display = true)}>Settings</a>

{#if display}
  <form
    on:submit|preventDefault
    transition:fly={{ x: -100, easing: backInOut }}>
    <div id="close" on:click={() => (display = false)}>X</div>
    <fieldset>
      <label for="num-of-lights">Number of Lights</label>
      <input
        name="num-of-lights"
        type="number"
        min="2"
        max="36"
        step="2"
        bind:value={$parameters.numOfLights}
        on:keypress|preventDefault />
    </fieldset>
    <hr />
    <fieldset>
      <label for="difficulty">Difficulty</label>
      <select
        name="difficulty"
        id="difficulty"
        bind:value={$parameters.difficulty}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="impossible">Impossible</option>
      </select>
    </fieldset>
    <hr />
    <fieldset>
      <button class="reset" on:click={resetScores}>Reset Scores</button>
      <button class="reset" on:click={resetDefault}>
        Reset Default Settings
      </button>
    </fieldset>

  </form>
{/if}
