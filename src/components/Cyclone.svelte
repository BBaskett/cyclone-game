<script context="module">
  const initial = 0;
</script>

<script>
  import { beforeUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import { parameters, stats } from "../stores.js";
  $: lightsArray = new Array($parameters.numOfLights);
  $: activeLight = initial;

  let winner = false;
  let state = "initial"; // Values: initial, running, stopped
  let lightInterval, difficultyInterval;

  function checkWinner() {
    const target = document.querySelector("div#target");
    const active = document.querySelector("div.active");
    if (target === active) {
      $stats.wins = $stats.wins + 1;
      $stats.streak = $stats.streak + 1;
      difficultyInterval = difficultyInterval * 0.9;
      winner = true;
    } else {
      $stats.losses = $stats.losses + 1;
      $stats.streak = 0;
    }
    return ($stats.plays = $stats.plays + 1);
  }

  function handleStop() {
    state = "stopped";
    clearInterval(lightInterval);
    return checkWinner();
  }

  function handleReset() {
    return window.location.reload(false);
  }

  function handleStart() {
    state = "running";
    difficultyInterval =
      $parameters.difficulty === "easy"
        ? 500
        : $parameters.difficulty === "medium"
        ? 200
        : $parameters.difficulty === "hard"
        ? 75
        : 10;
    return (lightInterval = setInterval(() => {
      return activeLight === 35
        ? (activeLight = 0)
        : (activeLight = activeLight + 1);
    }, difficultyInterval));
  }
</script>

<style>
  #cyclone {
    position: relative;
    width: 350px;
    height: 350px;
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

<p>{difficultyInterval}</p>
<main id="cyclone">
  {#each lightsArray as light, index}
    <div
      class={activeLight === index ? 'active' : ''}
      id={(360 / $parameters.numOfLights) * index === 180 ? 'target' : index}
      style={`transform: rotate(${(360 / $parameters.numOfLights) * index}deg) translate(calc(175px - 50%))`} />
  {/each}
</main>
{#if state === 'stopped'}
  <h1 transition:fade>
    {winner ? 'Winner, Winner, Chicken Dinner!' : 'Better luck next time!'}
  </h1>
{/if}
{#if state === 'initial'}
  <button class="start" on:click={handleStart}>Start</button>
{:else if state === 'running'}
  <button class="stop" on:click={handleStop}>Stop</button>
{:else}
  <button class="reset" on:click={handleReset}>Reset</button>
{/if}
