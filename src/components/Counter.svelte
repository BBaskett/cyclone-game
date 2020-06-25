<script>
  import { stats } from "../stores.js";
</script>

<style>
  table {
    width: 100%;
    padding: 1rem;
    border-radius: 0.25rem;
    background-color: hsl(0, 0%, 95%);
    box-shadow: 0 0.25rem 0.25rem 0 hsla(0, 0%, 50%, 0.35);
    border: 1px solid hsl(0, 0%, 65%);
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
      <td>{$stats.wins}</td>
      <td>{$stats.losses}</td>
      <td>{$stats.streak}</td>
    </tr>
  </tbody>
</table>
