<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Player, Season, Seasons } from '@/types.ts'

const players = ref<Seasons>({})

onMounted(async () => {
  const resp = await fetch('./data.json')
  players.value = await resp.json()
})

const allPlayers = computed(() => {
  const ret: (Player & { season: Season; team: string })[] = []
  Object.entries(players.value).forEach(function ([seasonName, season]) {
    Object.entries(season).forEach(function ([teamName, team]) {
      Object.values(team).forEach(function (player) {
        ret.push({ ...player, season: parseInt(seasonName), team: teamName })
      })
    })
  })
  return ret.sort((a, b) => (points(b) - points(a)));
})

const deslugTeam = (slug: string) =>
  slug
    .split('-')
    .map((slugPart: string) => String(slugPart).charAt(0).toUpperCase() + String(slugPart).slice(1))
    .join(' ')

function points({ stats: { tries, goals, field_goals } }: Player): number {
  console.log(tries, goals, field_goals)
  return 4 * (tries ?? 0) + 2 * (goals ?? 0) + (field_goals ?? 0)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Tries</th>
        <th>Goals</th>
        <th>Drop Goals</th>
        <th>Points</th>
        <th>Appearances</th>
        <th>Year</th>
        <th>Team</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in allPlayers.slice(0, 10)" :key="JSON.stringify(player)">
        <td v-text="player.name" />
        <td v-text="player.stats.tries" />
        <td v-text="player.stats.goals" />
        <td v-text="player.stats.field_goals" />
        <td v-text="points(player)" />
        <td v-text="player.stats.appearances" />
        <td v-text="player.season" />
        <td v-text="deslugTeam(player.team)" />
      </tr>
    </tbody>
  </table>
  <section v-for="(teams, year) in players" :key="year">
    <h2 v-text="year" />

    <section v-for="(players, team) in teams" :key="`${year}-${team}`">
      <template v-for="(details, url) in players" :key="`${year}-${team}-${url}`">
        <h4 v-text="details.name" />
        <ul>
          <li v-for="(value, stat) in details.stats">{{ stat }}: {{ value }}</li>
        </ul>
      </template>
    </section>
  </section>
</template>

<style scoped></style>
