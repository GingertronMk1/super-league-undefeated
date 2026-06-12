<script setup lang="ts">
import { computed, inject, onMounted, type Ref, ref } from 'vue'
import {
  type BasePlayer,
  type BaseTeam,
  type DreamTeam,
  type DreamTeamPlayer,
  type Player,
  type Season,
  type Team,
} from '@/types'
import { usePlayersStore } from '@/stores/players'
import { getPlayerRating, isForward, prettyPrintPositions } from '@/util'

const downTableModifier = inject<Ref<number>>('downTableModifier') ?? ref(1)
const forwardTriesModifier = inject<Ref<number>>('forwardTriesModifier') ?? ref(1)
const baseRate = inject<Ref<number>>('baseRate') ?? ref(50)

const playersStore = usePlayersStore()
const players = computed(() => playersStore.seasons)

type FullPlayer = Player & { season: Season; team: string }

const rawPlayers = ref<{ [key: Season]: Team[] }>({})
const dreamTeams = ref<{ [key: Season]: DreamTeam }>({})

const seasons = computed<{ [key: Season]: Team[] }>(() => {
  // Create a value to return
  const returnVal: Record<Season, Team[]> = {}

  // Take the players we get from JSON
  Object.entries(rawPlayers.value).forEach(function ([season, teams]) {
    const seasonNumber = parseInt(season) as Season
    const dreamTeamOfSeason: DreamTeam = dreamTeams.value[seasonNumber] ?? {}

    // Convert the players into the accoladed, rated versions
    // By cross-referencing the dream teams JSON file
    returnVal[seasonNumber] = teams.map(
      (team: BaseTeam): Team => ({
        ...team,
        players: team.players.map(function (player: BasePlayer) {
          const dreamTeamPlayer: DreamTeamPlayer | undefined = dreamTeamOfSeason[player.url]
          const accoladePlayer: Player = {
            ...player,
            dreamTeam: !!dreamTeamPlayer,
            mos: dreamTeamPlayer?.mos ?? false,
            rating: 0,
          }

          const proportionDownTable = team.finish / teams.length
          const teamSuccessStats = [
            baseRate.value - proportionDownTable * baseRate.value,
            team.finish === 1 ? 15 : 0,
            team.champions ? 25 : 0,
          ]
          const individualSuccessStats = [
            accoladePlayer.stats.starts / 10,
            accoladePlayer.stats.tries * (isForward(accoladePlayer) ? forwardTriesModifier.value : 1),
            accoladePlayer.stats.points * (isForward(accoladePlayer) ? forwardTriesModifier.value : 1),
            ((accoladePlayer.mos ? 50 : accoladePlayer.dreamTeam ? 25 : 0) *
              (1 + proportionDownTable)) ^
              downTableModifier.value,
          ]
          accoladePlayer.rating = [...teamSuccessStats, ...individualSuccessStats].reduce(
            (a, b) => a + b,
            0,
          )
          return accoladePlayer
        }),
      }),
    )
  })
  return returnVal
})

const allPlayers = computed(() => {
  return Object.entries(seasons.value).flatMap(([season, teams]) =>
    teams.flatMap((team) =>
      team.players.map((player) => ({
        ...player,
        season,
        team: team.name,
      })),
    ),
  )
})

const bestTeam = computed(() => {
  const [fb] = allPlayers.value.filter((p) => p.positions[0] === 'FB')
  const [w1, w2] = allPlayers.value.filter((p) => p.positions[0] === 'W')
  const [c1, c2] = allPlayers.value.filter((p) => p.positions[0] === 'C')
  const [so] = allPlayers.value.filter((p) => p.positions[0] === 'FE')
  const [sh] = allPlayers.value.filter((p) => p.positions[0] === 'HB')
  const [p1, p2] = allPlayers.value.filter((p) => p.positions[0] === 'FR')
  const [h] = allPlayers.value.filter((p) => p.positions[0] === 'H')
  const [sr1, sr2] = allPlayers.value.filter((p) => p.positions[0] === '2R')
  const [lf] = allPlayers.value.filter((p) => p.positions[0] === 'L')
  return [fb, w1, c1, c2, w2, so, sh, p1, h, p2, sr1, sr2, lf]
})

const numbers = computed(() => {
  const seasonCount = Object.keys(players.value).length
  const teamCount = Object.values(players.value).reduce((acc, season) => acc + season.length, 0)
  const playerCount = Object.values(players.value).reduce(
    (acc, season) => acc + season.reduce((acc, team) => acc + team.players.length, 0),
    0,
  )
  return { seasonCount, teamCount, playerCount }
})

const topNPlayers = computed(() => allPlayers.value.sort((a, b) => b.rating - a.rating).slice(0, 25))
const topNPlayerSplit = computed(() => ({
  forwards: topNPlayers.value.filter((p) => isForward(p)).length,
  backs: topNPlayers.value.filter((p) => !isForward(p)).length,
}))

function openAll() {
  document.body.querySelectorAll('details').forEach((e) => {
    e.hasAttribute('open') ? e.removeAttribute('open') : e.setAttribute('open', 'true')
  })
}

const normaliseScore = (player: Player) => Math.ceil(player.rating) //Math.ceil((player.rating / highestRating.value) * 100)

onMounted(async () => {
  const seasonResp = await fetch('./data.json')
  rawPlayers.value = await seasonResp.json()
  const dreamTeamResp = await fetch('./dream-teams.json')
  dreamTeams.value = await dreamTeamResp.json()
})
</script>

<template>
  <div
    class="flex flex-col [&_table_tr>*]:p-2 [&_table_tbody_tr:nth-child(2n)]:bg-gray-300 [&_h3]:text-lg [&_h2]:text-xl w-[95%] max-w-7xl [&_h1,h2,h3]:font-bold space-y-4"
  >
    <button @click="openAll()">Open All</button>
    <h2 v-if="playersStore.loading">Loading...</h2>
    <template v-else>
      <section>
        <h2>{{ numbers.seasonCount }} seasons</h2>
        <h2>{{ numbers.teamCount }} teams</h2>
        <h2>{{ numbers.playerCount }} players</h2>
      </section>
    </template>
    <h2>Top Players ({{ topNPlayerSplit.forwards }} forwards, {{ topNPlayerSplit.backs }} backs)</h2>
    <table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Player</th>
          <th>Positions</th>
          <th>Forward?</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in topNPlayers" :key="JSON.stringify(player)">
          <td v-text="`${player.season} ${player.team}`" />
          <td v-text="player.name" />
          <td v-text="prettyPrintPositions(player)" />
          <td
            v-text="isForward(player) ? 'Yes' : 'No'"
            :class="{
              'bg-green-500': isForward(player),
              'bg-red-500': !isForward(player),
            }"
          />
          <td v-text="normaliseScore(player)" />
        </tr>
      </tbody>
    </table>

    <h2>Best Team Ever</h2>
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Year</th>
          <th>Player</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="player in bestTeam" :key="JSON.stringify(player)">
          <tr v-if="player">
            <td v-text="player.positions[0]" />
            <td v-text="player.season" />
            <td v-text="player.name" />
            <td v-text="Math.ceil(player.rating)" />
          </tr>
        </template>
      </tbody>
    </table>

    <!-- TEAMS AND YEARS -->
    <details v-for="(teams, year) in players" :key="year" :id="`${year}`" class="space-y-2">
      <summary v-text="year" />

      <details
        v-for="team in teams"
        :key="`${year}-${team.name}`"
        class="pl-2"
        :id="`${year}-${team.name}`"
      >
        <summary v-text="`${team.name} (${team.finish}) ${team.champions ? '(Champions)' : ''}`" />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Positions</th>
              <th>Apps</th>
              <th>Tries</th>
              <th>Points</th>
              <th>Rating</th>
              <th>Dream Team?</th>
              <th>MoS?</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in team.players.sort((p1, p2) => p2.rating - p1.rating)"
              :key="`${year}-${team}-${player.url}`"
            >
              <td v-text="player.name" />
              <td v-text="prettyPrintPositions(player)" />
              <td v-text="player.stats.appearances" />
              <td v-text="player.stats.tries" />
              <td v-text="player.stats.points" />
              <td v-text="normaliseScore(player)" />
              <td>
                {{ player.dreamTeam ? 'yes' : 'no' }}
              </td>
              <td>
                {{ player.mos ? 'yes' : 'no' }}
              </td>
            </tr>
          </tbody>
        </table>
      </details>
    </details>
  </div>
</template>

<style scoped></style>
