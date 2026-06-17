<script setup lang="ts">
import { computed } from 'vue'
import type { FullPlayer, Season, Team } from '@/types'
import { usePlayersStore } from '@/stores/players'
import { isForward, prettyPrintPositions } from '@/util'
import TableRow from '@/components/TableRow.vue'

const playersStore = usePlayersStore()
const players = computed(() => playersStore.seasons)

const seasons = computed<{ [key: Season]: Team[] }>(() => playersStore.seasons)

const allPlayers = computed<FullPlayer[]>(() => playersStore.allPlayers)
const bestAndWorst = computed(() => playersStore.bestAndWorst)

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

const topNPlayers = computed(() => [...allPlayers.value].sort((a, b) => b.rating - a.rating))

const getTeamAverageRating = (team: Team): number =>
  team.players.reduce((prev, curr) => prev + curr.rating, 0) / team.players.length
</script>

<template>
  <div
    class="flex flex-col [&_table_tr>*]:p-2 [&_table_tbody_tr:nth-child(2n)]:bg-gray-300 [&_h3]:text-lg [&_h2]:text-xl [&_h1,h2,h3]:font-bold space-y-4"
  >
    <h2 v-if="playersStore.loading">Loading...</h2>
    <template v-else>
      <section>
        <h2>{{ numbers.seasonCount }} seasons</h2>
        <h2>{{ numbers.teamCount }} teams</h2>
        <h2>{{ numbers.playerCount }} players</h2>
      </section>
    </template>
    <h2>Top Players</h2>
    <h4 v-if="bestAndWorst.best">
      Top score: {{ bestAndWorst.best.season }} {{ bestAndWorst.best.name }} with
      {{ bestAndWorst.best.rating.toFixed(2) }}
    </h4>
    <h4 v-if="bestAndWorst.worst">
      Bottom score: {{ bestAndWorst.worst.season }} {{ bestAndWorst.worst.name }} with
      {{ bestAndWorst.worst.rating.toFixed(2) }}
    </h4>

    <div class="relative w-full min-h-100 bg-blue-200" v-if="bestAndWorst.best">
      <i
        v-for="(player, index) in allPlayers"
        :key="index"
        class="w-1 h-1 absolute -translate-0.5"
        :class="{
          'bg-yellow-500 z-1000': player.mos,
          'bg-green-500 z-100': !player.mos && player.dreamTeam,
          'bg-red-500 z-1': !(player.mos || player.dreamTeam),
        }"
        :style="{
          left: `calc(5% + ${(index / allPlayers.length) * 90}%)`,
          bottom: `calc(5% + ${player.rating * 0.9}%)`,
        }"
        :title="`${player.season} ${player.name} ${player.rating.toFixed(2)}`"
      />
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th>Year</th>
          <th>Player</th>
          <th>Positions</th>
          <th>Accolade?</th>
          <th>Forward?</th>
          <th>Tries</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in topNPlayers.slice(0, 25)" :key="JSON.stringify(player)">
          <td v-text="`${player.season} ${player.team}`" />
          <td v-text="player.name" />
          <td v-text="prettyPrintPositions(player.positions)" />
          <td v-text="[
            player.mos ? 'Man of Steel' : player.dreamTeam ? 'Dream Team' : false,
            player.lanceTodd ? 'Lance Todd' : false
            ].filter((s) => s).join(', ')" />
          <td
            :class="{
              'bg-green-500': isForward(player),
              'bg-red-500': !isForward(player),
            }"
          >
            {{ isForward(player) ? 'Yes' : 'No' }}
          </td>

          <td v-text="`${player.stats.tries}`" />
          <td>
            <span v-text="player.rating.toFixed(2)" />
          </td>
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
            <td>
              <span v-text="player.rating.toFixed(2)" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <ul>
      <li v-for="(teams, year) in seasons" :key="year">
        <a :href="`#year-${year}`" v-text="year" class="px-2 py-1 hover:bg-gray-200" />
        <ul class="pl-4">
          <li v-for="team in teams" :key="team.name">
            <a
              :href="`#year-${year}-team-${team.name}`"
              v-text="`${team.name} - ${getTeamAverageRating(team).toFixed(2)}`"
              class="px-2 py-1 hover:bg-gray-200"
            />
          </li>
        </ul>
      </li>
    </ul>

    <!-- TEAMS AND YEARS -->
    <section class="divide-y-2 divide-gray-300">
      <section
        v-for="(teams, year) in seasons"
        :key="year"
        :id="`${year}`"
        class="flex flex-col gap-4"
      >
        <a :id="`year-${year}`" />
        <h3 v-text="year" class="text-xl" />

        <section
          v-for="team in teams"
          :key="`${year}-${team.name}`"
          class="pl-4"
          :id="`${year}-${team.name}`"
        >
          <a :id="`year-${year}-team-${team.name}`" />
          <h4
            v-text="
              `${team.name} (${team.finish}) (${getTeamAverageRating(team).toFixed(2)}) ${team.champions ? '(Champions)' : ''}`
            "
            class="text-lg"
          />
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-1/8">Name</th>
                <th class="w-1/3">Positions</th>
                <th class="w-1/12">Apps</th>
                <th class="w-1/12">Tries</th>
                <th class="w-1/12">Points</th>
                <th class="w-1/8">Dream Team?</th>
                <th class="w-1/12">MoS?</th>
                <th class="w-1/12">Lance Todd?</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                v-for="player in [...team.players].sort((a, b) => b.rating - a.rating)"
                :player="player"
                :key="`${year}-${team}-${player.url}`"
              />
            </tbody>
          </table>
        </section>
      </section>
    </section>
  </div>
</template>

<style scoped></style>
