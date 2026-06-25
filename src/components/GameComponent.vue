<script setup lang="ts">
import type { ChosenTeam, PlayerToChoose, ResultsTeam, TableTeam, Team } from '@/types.ts'
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import PlayoffComponent from '@/components/game/PlayoffComponent.vue'
import { generateBestPossibleTeam } from '@/util.ts'
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts'
import useGame from '@/composables/useGame.ts'
import { PLAYER_TEAM_NAME } from '@/constants.ts'

const props = defineProps<{
  chosenTeam: ChosenTeam<PlayerToChoose>
}>()

const { mean } = useStatisticalMethods()
const { simulateSeason, simulatePlayoffs } = useGame()

const refreshKey = ref(new Date())

const playersStore = usePlayersStore()
const lastSeasonsTeams = computed<TableTeam[]>(() => {
  const teams = Object.entries(playersStore.seasons).reduce(
    ([
      year,
      teams]: [string, Team[],
    ], [
      currYear,
      currTeams]: [string, Team[],
    ]) => (parseInt(currYear) > parseInt(year)
      ? [currYear,
          currTeams]
      : [year,
          teams]),
    [
      '0',
      [],
    ],
  )[1]
  return teams.map(t => ({
    name: t.name,
    rating: mean(generateBestPossibleTeam(t.players).map(p => p.rating)),
  }))
})

const allTeams = computed(() => [
  {
    name: PLAYER_TEAM_NAME,
    rating: mean(Object.values(props.chosenTeam).map(p => p?.rating ?? 0)),
  },
  ...lastSeasonsTeams.value,
])

const results = computed(() => {
  refreshKey.value
  return simulateSeason(allTeams.value)
})

const table = computed<ResultsTeam[]>(() => allTeams.value
  .map((team) => {
    const teamResults = results.value.filter(r => r.home === team.name || r.away === team.name)
    const wins = teamResults.filter(r => r.result === team.name).length
    const draws = teamResults.filter(r => r.result === 'draw').length
    const losses = teamResults.filter(r => r.result !== team.name && r.result !== 'draw').length
    return {
      name: team.name,
      rating: team.rating,
      wins,
      draws,
      losses,
      points: wins * 2 + draws,
    }
  })
  .sort((a, b) => b.points - a.points))

const playoffs = computed(() => {
  const [
    first,
    second,
    third,
    fourth,
    fifth,
    sixth,
  ] = table.value
  if (
    first === undefined
    || second === undefined
    || third === undefined
    || fourth === undefined
    || fifth === undefined
    || sixth === undefined
  ) {
    throw new Error('Table is not ready')
  }
  return simulatePlayoffs(
    first,
    second,
    third,
    fourth,
    fifth,
    sixth,
  )
})
</script>

<template>
  <button
    class="cursor-pointer"
    @click="refreshKey = new Date()"
  >
    Reload
  </button>
  <CardComponent>
    <h2 class="col-span-full text-3xl font-bold mb-2">
      The Regular Season
    </h2>
    <div class="*:grid *:grid-cols-6 gap-x-4 [&>*:nth-child(even)]:bg-gray-300">
      <div class="text-lg font-semibold">
        <span>Team</span>
        <span>Rating</span>
        <span>Wins</span>
        <span>Draws</span>
        <span>Losses</span>
        <span>Points</span>
      </div>
      <div
        v-for="row in table"
        :key="JSON.stringify(row)"
        :class="row.name === PLAYER_TEAM_NAME ? 'font-semibold' : ''"
      >
        <span v-text="row.name === PLAYER_TEAM_NAME ? 'You' : row.name" />
        <span v-text="row.rating.toFixed(2)" />
        <span v-text="row.wins" />
        <span v-text="row.draws" />
        <span v-text="row.losses" />
        <span v-text="row.points" />
      </div>
    </div>
  </CardComponent>

  <CardComponent class="flex flex-col gap-y-2">
    <h2 class="col-span-full text-3xl font-bold mb-2">
      The Playoffs
    </h2>
    <PlayoffComponent
      title="Eliminator 1"
      :match="playoffs.eliminator1"
      :winner="playoffs.eliminator1Winner"
    />
    <PlayoffComponent
      title="Eliminator 2"
      :match="playoffs.eliminator2"
      :winner="playoffs.eliminator2Winner"
    />
    <PlayoffComponent
      title="Semi-Final 1"
      :match="playoffs.semiFinal1"
      :winner="playoffs.semiFinal1Winner"
    />
    <PlayoffComponent
      title="Semi-Final 2"
      :match="playoffs.semiFinal2"
      :winner="playoffs.semiFinal2Winner"
    />
    <PlayoffComponent
      title="The Grand Final"
      :match="playoffs.grandFinal"
      :winner="playoffs.grandFinalWinner"
    />
  </CardComponent>

  <CardComponent class="overflow-x-scroll">
    <table class="[&_tr>*]:p-2 [&_tr:nth-of-type(2n)]:bg-gray-300 max-w-full">
      <thead>
        <tr>
          <th />
          <th
            v-for="team in allTeams"
            :key="JSON.stringify(team)"
            v-text="team.name"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="team in allTeams"
          :key="JSON.stringify(team)"
        >
          <td
            class="font-bold"
            v-text="team.name"
          />
          <td
            v-for="opponent in allTeams"
            :key="JSON.stringify({ team, opponent })"
          >
            <span v-if="team.name !== opponent.name">
              {{ results.find((r) => r.home === team.name && r.away === opponent.name)?.result }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </CardComponent>
</template>

<style scoped></style>
