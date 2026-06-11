<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  type Player,
  type Position,
  POSITION_ENUM,
  type RatedPlayer,
  type Season,
} from '@/types.ts'
import { usePlayersStore } from '@/stores/players.ts'
import { getRatedPlayers } from './util.ts'

const playersStore = usePlayersStore()
const players = computed(() => playersStore.players)

const allPlayers = computed(() => {
  const ret: (RatedPlayer & { season: Season; team: string })[] = []
  Object.entries(players.value).forEach(function ([seasonName, season]) {
    season.forEach(function (team) {
      getRatedPlayers(team, season.length).forEach(function (player: RatedPlayer) {
        ret.push({ ...player, season: parseInt(seasonName), team: team.name })
      })
    })
  })
  return ret.sort((a: RatedPlayer, b: RatedPlayer) => b.rating - a.rating)
})

const deslugTeam = (slug: string) =>
  slug
    .split('-')
    .map((slugPart: string) => String(slugPart).charAt(0).toUpperCase() + String(slugPart).slice(1))
    .join(' ')

function points({ stats: { tries, goals, field_goals } }: Player): number {
  return 4 * (tries ?? 0) + 2 * (goals ?? 0) + (field_goals ?? 0)
}

const numbers = computed(() => {
  const seasonCount = Object.keys(players.value).length
  const teamCount = Object.values(players.value).reduce((acc, season) => acc + season.length, 0)
  const playerCount = Object.values(players.value).reduce(
    (acc, season) =>
      acc + season.reduce((acc, team) => acc + getRatedPlayers(team, season.length).length, 0),
    0,
  )
  return { seasonCount, teamCount, playerCount }
})

onMounted(async () => {
  console.log('getting players')
  await playersStore.getPlayers()
  console.log('got players')
})
</script>

<template>
  <div
    class="flex flex-col [&_table_tr>*]:p-2 [&_table_tbody_tr:nth-child(2n)]:bg-gray-300 [&_h3]:text-lg [&_h2]:text-xl w-[95%] max-w-7xl"
  >
    <h2 v-if="playersStore.loading">Loading...</h2>
    <template v-else>
      <h2>{{ numbers.seasonCount }} seasons</h2>
      <h2>{{ numbers.teamCount }} teams</h2>
      <h2>{{ numbers.playerCount }} players</h2>
    </template>
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Tries</th>
          <th>Points</th>
          <th>Apps</th>
          <th>Year</th>
          <th>Team</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in allPlayers.slice(0, 10)" :key="JSON.stringify(player)">
          <td v-text="player.name" />
          <td v-text="player.stats.tries" />
          <td v-text="points(player)" />
          <td v-text="player.stats.appearances" />
          <td v-text="player.season" />
          <td v-text="deslugTeam(player.team)" />
          <td v-text="Math.ceil(player.rating)" />
        </tr>
      </tbody>
    </table>
    <section v-for="(teams, year) in players" :key="year" :id="`${year}`">
      <h2 v-text="year" />

      <section
        v-for="team in teams"
        :key="`${year}-${team.name}`"
        class="pl-2"
        :id="`${year}-${team.name}`"
      >
        <h3 v-text="`${team.name} (${team.finish}) ${team.champions ? '(Champions)' : ''}`" />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Positions</th>
              <th>Apps</th>
              <th>Tries</th>
              <th>Points</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in getRatedPlayers(team, teams.length).sort(
                (p1, p2) => p2.rating - p1.rating,
              )"
              :key="`${year}-${team}-${player.url}`"
            >
              <td v-text="player.name" />
              <td v-text="player.positions.map((pos: Position) => POSITION_ENUM[pos]).join(', ')" />
              <td v-text="player.stats.appearances" />
              <td v-text="player.stats.tries" />
              <td v-text="player.stats.points" />
              <td v-text="Math.ceil(player.rating)" />
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  </div>
</template>

<style scoped></style>
