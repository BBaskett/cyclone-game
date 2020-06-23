<script>
  import { stats } from "../stores.js";
</script>

<style>
  table {
    width: 100%;
  }

  td {
    text-align: center;
    font-size: 0.75rem;
  }
</style>

<table>
  <thead>
    <tr>
      <th>Plays</th>
      <th class="win">Wins</th>
      <th class="loss">Losses</th>
      <th class="streak">Streak</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{$stats.plays}</td>
      <td>
        {$stats.wins}
        {#if $stats.plays > 0}
          ({(($stats.wins / $stats.plays) * 100).toFixed(2)}%)
        {/if}
      </td>
      <td>
        {$stats.losses}
        {#if $stats.plays > 0}
          ({(($stats.losses / $stats.plays) * 100).toFixed(2)}%)
        {/if}
      </td>
      <td>{$stats.streak}</td>
    </tr>
  </tbody>
</table>
