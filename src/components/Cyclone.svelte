<script context="module">
  const initial = 0;
</script>

<script>
  import { beforeUpdate } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { _message, parameters, stats } from "../stores.js";

  $: lightsArray = new Array($parameters.numOfLights);
  $: activeLight = 0;

  let winner = false;
  let state = "initial"; // Values: initial, running, stopped
  let lightInterval;

  function checkWinner() {
    const target = document.querySelector("div#target");
    const active = document.querySelector("div.active");
    if (target === active) {
      $stats.wins = $stats.wins + 1;
      $stats.streak = $stats.streak + 1;
      winner = true;
      $_message = "Winner, Winner, Chicken Dinner!";
    } else {
      $stats.losses = $stats.losses + 1;
      $stats.streak = 0;
      $_message = "Better luck next time.";
    }
    return ($stats.plays = $stats.plays + 1);
  }

  function handleStop() {
    state = "stopped";
    clearInterval(lightInterval);
    return checkWinner();
  }

  function handleReset() {
    activeLight = 0;
    $_message = null;
    return (state = "initial");
  }

  function handleStart() {
    state = "running";
    let difficultyInterval =
      $parameters.difficulty === "easy"
        ? 500
        : $parameters.difficulty === "medium"
        ? 200
        : $parameters.difficulty === "hard"
        ? 75
        : 10;
    if ($stats.streak > 0) {
      difficultyInterval = difficultyInterval * Math.pow(0.9, $stats.streak);
    }
    return (lightInterval = setInterval(() => {
      return activeLight === lightsArray.length - 1
        ? (activeLight = 0)
        : (activeLight = activeLight + 1);
    }, difficultyInterval));
  }
</script>

<style>
  #cyclone {
    position: relative;
    width: 325px;
    height: 325px;
    border-radius: 50%;
    transform: rotate(-90deg);
    margin-bottom: 2rem;
  }

  div {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.6rem;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    transition: 0.25s ease;
    user-select: none;
  }
</style>

<main id="cyclone" transition:slide>
  {#each lightsArray as light, index}
    <div
      class={activeLight === index ? 'active' : ''}
      id={(360 / $parameters.numOfLights) * index === 180 ? 'target' : index}
      style={`transform: rotate(${(360 / $parameters.numOfLights) * index}deg) translate(calc(175px - 50%))`} />
  {/each}
</main>
{#if state === 'initial'}
  <button
    class="start"
    on:click={handleStart}
    transition:slide={{ duration: 100 }}>
    Start
  </button>
{:else if state === 'running'}
  <button
    class="stop"
    on:click={handleStop}
    transition:slide={{ duration: 100 }}>
    Stop
  </button>
{:else}
  <button class="reset" on:click={handleReset} transition:slide>
    {$stats.streak > 0 ? 'Next Level' : 'Reset'}
  </button>
{/if}
