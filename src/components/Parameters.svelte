<script>
  export let defaults, storage, lastVisit;

  import { afterUpdate, beforeUpdate } from "svelte";
  import { slide, fly } from "svelte/transition";
  import { backInOut } from "svelte/easing";
  import { parameters, stats, _showSettings } from "../stores.js";

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
  }

  function validateKeypress(event) {
    // Validate whether the keypress is within the parameters
    if (
      !event.code.includes("Digit") ||
      (event.key + event.target.value).length > 2 ||
      (event.target.value.length === 0 && event.key === "0") ||
      (event.target.value.length === 1 && event.target.value > 3) ||
      (event.target.value.length > 0 &&
        event.target.value[0] === "3" &&
        event.key > 6)
    ) {
      return event.preventDefault();
    }
  }

  function onBlur(event) {
    // If the value is not even, disregard
    if (event.target.value % 2 !== 0 || event.target.value.length === 0) {
      return event.target.classList.add("error");
    } else {
      if (event.target.className.includes("error")) {
        return event.target.classList.remove("error");
      }
    }
  }

  function closeHandler(event) {
    const numOfLightsInput = document.querySelector(
      'input[name="num-of-lights"]'
    );
    // Don't close if input is in error state
    if (numOfLightsInput.className.includes("error")) {
      return;
    }
    return ($_showSettings = false);
  }
</script>

<style>
  @media (min-width: 999px) {
    form {
      width: 50vw !important;
      border-right: 1px solid hsl(0, 0%, 65%);
      box-shadow: 0.25rem 0 1rem 0 hsla(0, 0%, 50%, 0.35);
    }
  }
  form {
    position: absolute;
    background-color: hsl(0, 0%, 100%);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 2rem;
    z-index: 100;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 1rem;
  }

  .row.button-row {
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .row + .row {
    border-top: 1px solid hsl(0, 0%, 85%);
  }

  .row > .row-label {
    font-weight: 700;
  }

  .row > .break {
    flex-basis: 100%;
    height: 0;
  }

  .row > .description {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  #close {
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: right;
    margin-bottom: 1rem;
  }

  #lastVisit {
    font-size: 0.75rem;
    font-weight: 300;
    color: hsl(0, 0%, 50%);
  }
</style>

{#if $_showSettings}
  <form
    on:submit|preventDefault
    transition:fly={{ x: -100, easing: backInOut }}>
    <div id="close" on:click={closeHandler} title="close">x</div>
    <h1>
      Settings
      {#if lastVisit}
        <div id="lastVisit">Last visited {lastVisit}</div>
      {/if}
    </h1>
    <div class="row">
      <span class="row-label">Number of Lights</span>
      <input
        name="num-of-lights"
        type="number"
        min="2"
        max="36"
        step="2"
        pattern="[0-9]*"
        bind:value={$parameters.numOfLights}
        on:keypress={validateKeypress}
        on:blur={onBlur} />
      <div class="break" />
      <span class="description">
        The number of lights in the cyclone (Must be even! Min: 2, Max: 36).
      </span>
    </div>
    <div class="row">
      <span class="row-label">Difficulty</span>
      <select name="difficulty" bind:value={$parameters.difficulty}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
        <option value="Impossible">Impossible</option>
      </select>
      <div class="break" />
      <span class="description">
        The speed at which the lights change increases (in no specific
        linearity) with difficulty.
      </span>
    </div>
    <div class="row button-row">
      <button class="reset" on:click={resetScores}>Reset Scores</button>
      <button class="reset" on:click={resetDefault}>
        Reset Default Settings
      </button>
    </div>
  </form>
{/if}
