<script>
  import { beforeUpdate } from "svelte";
  import { _message } from "../stores.js";
  import { slide } from "svelte/transition";

  let display = false;

  beforeUpdate(() => {
    if ($_message === null) {
      return (display = false);
    } else {
      return (display = true);
    }
  });
</script>

<style>
  p {
    font-weight: 500;
  }
</style>

{#if display}
  <div class="modal" transition:slide|global>
    <p>
      {@html $_message}
    </p>
  </div>
{/if}
