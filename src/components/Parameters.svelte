<script>
  export let defaults, storage;

  import { afterUpdate, beforeUpdate } from "svelte";
  import { highScore, parameters } from "../stores.js";

  let display = false;

  function resetHighScore() {
    if (
      window.confirm(
        "Are you sure you want to reset the high score to zero (0)?"
      )
    ) {
      $highScore = 0;
      display = !display;
      return window.location.reload(false);
    }
  }

  function resetDefault() {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to their default values?"
      )
    ) {
      $parameters = defaults;
      updateStorage();
      display = !display;
      return window.location.reload(false);
    }
  }

  function updateStorage() {
    return window.localStorage.setItem(
      storage,
      JSON.stringify({
        lastVisit: Date.now(),
        highScore: $highScore,
        parameters: $parameters
      })
    );
  }

  function validateKeypress(event) {
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
  }
</script>

<style>
  label {
    font-weight: 700;
  }
</style>

<form on:submit|preventDefault>
  <fieldset>
    <label for="display">Show Parameters</label>
    <input name="display" type="checkbox" bind:checked={display} />
  </fieldset>
  {#if display}
    <fieldset>
      <label for="num-of-lights">Number of Lights</label>
      <input
        name="num-of-lights"
        type="number"
        min="0"
        max="36"
        step="1"
        bind:value={$parameters.numOfLights}
        on:keypress|self={validateKeypress} />
    </fieldset>
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
      <label class="danger" for="danger-zone">Danger Zone</label>
      <button class="reset" on:click={resetHighScore}>Reset High Score</button>
      <button class="reset" on:click={resetDefault}>
        Reset Default Settings
      </button>
    </fieldset>
  {/if}
</form>
