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

  var createNodes = function(numNodes, radius) {
    var nodes = [],
      width = radius * 2 + 50,
      height = radius * 2 + 50,
      angle,
      x,
      y,
      i;
    for (i = 0; i < numNodes; i++) {
      angle = (i / (numNodes / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
      // For a semicircle, we would use (i / numNodes) * Math.PI.
      x = radius * Math.cos(angle) + width / 2; // Calculate the x position of the element.
      y = radius * Math.sin(angle) + width / 2; // Calculate the y position of the element.
      nodes.push({ id: i, x: x, y: y });
    }
    return nodes;
  };

  var createSvg = function(radius, callback) {
    d3.selectAll("svg").remove();
    var svg = d3
      .select("#canvas")
      .append("svg:svg")
      .attr("width", radius * 2 + 50)
      .attr("height", radius * 2 + 50);
    callback(svg);
  };

  var createElements = function(svg, nodes, elementRadius) {
    svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("svg:circle")
      .attr("r", elementRadius)
      .attr("cx", function(d, i) {
        return d.x;
      })
      .attr("cy", function(d, i) {
        return d.y;
      });
  };

  var draw = function() {
    const numNodes = $parameters.numOfLights;
    /* const radius =
      window.innerWidth > window.innerHeight
        ? window.innerWidth * 0.65
        : window.innerHeight * 0.85; */
    const radius = window.innerHeight * 0.25;
    var nodes = createNodes(numNodes, radius);
    createSvg(radius, function(svg) {
      createElements(svg, nodes, radius / nodes.length);
    });
  };

  beforeUpdate(() => {
    draw();
  });
</script>

<div id="canvas" />

<!-- <section
  id="cycloneContainer"
  style={`height: ${window.innerWidth > window.innerHeight ? '65vh' : '85vw'}; width: ${window.innerWidth > window.innerHeight ? '65vh' : '85vw'};`}>
  {#each lightsArray as light, index}
    <div
      class={index === 0 ? 'circle active' : index === lightsArray.length / 2 - 1 ? 'circle target' : 'circle'}
      style={`transform: translate(${window.innerWidth > window.innerHeight ? (window.innherHeight * 0.65) / lightsArray.length : (window.innerWidth * 0.85) / lightsArray.length + 'px'})`} />
  {/each}
</section> -->

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
