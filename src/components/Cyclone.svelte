<script context="module">
  const initial = 0;
</script>

<script>
  import { beforeUpdate } from "svelte";
  import { _message, parameters, stats } from "../stores.js";

  let winner = false;
  let state = "initial"; // Values: initial, running, stopped
  let lightInterval,
    level = $parameters.difficulty;
  let dimensionReference =
    window.innerHeight < window.innerWidth
      ? window.innerHeight
      : window.innerWidth;

  $: lightsArray = new Array($parameters.numOfLights);
  $: activeLight = 0;
  $: level =
    $stats.streak > 0
      ? "Less-".repeat($stats.streak) + $parameters.difficulty
      : $parameters.difficulty;

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
      $parameters.difficulty === "Easy"
        ? 500
        : $parameters.difficulty === "Medium"
        ? 200
        : $parameters.difficulty === "Hard"
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
  .container {
    position: relative;
    border: 1px solid hsl(0, 0%, 85%);
    border-radius: 50%;
    transform: rotate(270deg);
  }

  .container > .circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid hsl(0, 0%, 65%);
    transition: 0.25s ease;
    width: 24px;
    height: 24px;
    top: calc(50% - 12px);
    left: calc(50% - 12px);
  }

  #level {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    text-align: center;
  }
</style>

<div
  class="container"
  style={`height: ${window.innerHeight < window.innerWidth ? window.innerHeight * 0.75 : window.innerWidth * 0.75}px; width: ${window.innerHeight < window.innerWidth ? window.innerHeight * 0.75 : window.innerWidth * 0.75}px`}>
  {#each lightsArray as light, index}
    <div
      id={index === lightsArray.length / 2 ? 'target' : index}
      class={index === activeLight ? 'circle active' : 'circle'}
      style={`transform: rotate(${(360 / lightsArray.length) * index}deg) translateX(${dimensionReference * 0.375}px);`} />
    <!-- style={`height: ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length + 'px' : (window.innerWidth * 0.75) / lightsArray.length + 'px'}; width: ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length + 'px' : (window.innerWidth * 0.75) / lightsArray.length + 'px'}; top: calc(50% - ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length / 2 + 'px' : (window.innerWidth * 0.75) / lightsArray.length / 2 + 'px'}); left: calc(50% - ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length / 2 + 'px' : (window.innerWidth * 0.75) / lightsArray.length / 2 + 'px'}); transform: rotate(${(360 / lightsArray.length) * index}deg) translateX(${window.innerHeight < window.innerWidth ? window.innerHeight * 0.375 : window.innerWidth * 0.375}px);`} -->
  {/each}
  <div id="level">
    <strong>Level:</strong>
    {level}
  </div>
</div>

{#if state === 'initial'}
  <button class="start" on:click={handleStart}>Start</button>
{:else if state === 'running'}
  <button class="stop" on:click={handleStop}>Stop</button>
{:else}
  <button class="reset" on:click={handleReset}>
    {$stats.streak > 0 ? 'Next Level' : 'Reset'}
  </button>
{/if}
