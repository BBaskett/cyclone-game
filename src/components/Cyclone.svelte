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
  }
</style>

<div
  class="container"
  style={`height: ${window.innerHeight < window.innerWidth ? window.innerHeight * 0.75 : window.innerWidth * 0.75}px; width: ${window.innerHeight < window.innerWidth ? window.innerHeight * 0.75 : window.innerWidth * 0.75}px`}>
  {#each lightsArray as light, index}
    <div
      id={index === lightsArray.length / 2 ? 'target' : index}
      class={index === activeLight ? 'circle active' : 'circle'}
      style={`height: ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length + 'px' : (window.innerWidth * 0.75) / lightsArray.length + 'px'}; width: ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length + 'px' : (window.innerWidth * 0.75) / lightsArray.length + 'px'}; top: calc(50% - ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length / 2 + 'px' : (window.innerWidth * 0.75) / lightsArray.length / 2 + 'px'}); left: calc(50% - ${window.innerHeight < window.innerWidth ? (window.innerHeight * 0.75) / lightsArray.length / 2 + 'px' : (window.innerWidth * 0.75) / lightsArray.length / 2 + 'px'}); transform: rotate(${(360 / lightsArray.length) * index}deg) translateX(${window.innerHeight < window.innerWidth ? window.innerHeight * 0.375 : window.innerWidth * 0.375}px);`} />
  {/each}
</div>

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
