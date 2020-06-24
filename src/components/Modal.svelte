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

{#if display}
  <div class="modal" transition:slide>
    <p>{$_message}</p>
  </div>
{/if}
