<script context="module">
  const initial = 0;
</script>

<script>
  import { beforeUpdate } from "svelte";
  import { acceleration, highScore, parameters } from "../stores.js";
  $: lightsArray = new Array($parameters.numOfLights);
  $: activeLight = initial;

  let winner = false;
  let state = "initial"; // Values: initial, running, stopped
  let lightInterval;

  function checkWinner() {
    const target = document.querySelector("div#target");
    const active = document.querySelector("div.active");
    if (target === active) {
      $highScore = $highScore + 1;
      return (winner = true);
    }
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
    const difficultyInterval =
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
    width: 60vh; /* 24rem */
    max-width: 80vw;
    height: 60vh; /* 24rem */
    max-height: 80vw;
    /* padding: 2.8rem; */ /* 2.8rem */
    border-radius: 50%;
    margin: 1.75em auto 0;
    transform: rotate(-90deg);
  }

  section {
    margin-top: 2rem;
  }

  div {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -1rem;
    height: 2.5vh; /* 2rem */
    width: 2.5vh; /* 2rem */
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    transition: 0.25s ease;
    user-select: none;
  }
</style>

{#if state === 'stopped'}
  {#if winner}
    <h1>Winner, Winner, Chicken Dinner!</h1>
  {:else}
    <h1>Better luck next time!</h1>
  {/if}
{:else}
  <main id="cyclone">
    {#each lightsArray as light, index}
      <div
        class={activeLight === index ? 'active' : ''}
        id={(360 / $parameters.numOfLights) * index === 180 ? 'target' : index}
        style={window.innerHeight > window.innerWidth ? `transform: rotate(${(360 / $parameters.numOfLights) * index}deg) translate(40vw)` : `transform: rotate(${(360 / $parameters.numOfLights) * index}deg) translate(30vh)`} />
    {/each}
  </main>
{/if}
<section>
  {#if state === 'initial'}
    <button class="start" on:click={handleStart}>Start</button>
  {:else if state === 'running'}
    <button class="stop" on:click={handleStop}>Stop</button>
  {:else}
    <button class="reset" on:click={handleReset}>Reset</button>
  {/if}
</section>
