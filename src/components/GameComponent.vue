<script setup lang="ts">
import type { ChosenTeam, Match, Player, Season, TableTeam, Team, TeamName } from '@/types.ts'
import { usePlayersStore } from '@/stores/players.ts'
import { computed, inject, type Ref, ref } from 'vue'
import { INITIAL_STAT_MODIFIERS, INJECTABLES } from '@/constants.ts'

const props = defineProps<{
  chosenTeam: ChosenTeam
}>()

const PLAYER_TEAM_NAME = 'PLAYER_TEAM'
const refreshKey = ref(new Date())

const playersStore = usePlayersStore()
const lastSeasonsTeams = computed<TableTeam[]>(() => {
  const teams = Object.entries(playersStore.seasons).reduce(
    ([year, teams]: [string, Team[]], [currYear, currTeams]: [string, Team[]]) =>
      parseInt(currYear) > parseInt(year) ? [currYear, currTeams] : [year, teams],
    ['0', []],
  )[1]
  return teams.map((t) => ({
    name: t.name,
    rating: getTeamAverageRating(t.players),
  }))
})

const getTeamAverageRating = (players: ({ rating: number } | null)[]): number =>
  players.reduce((prev, curr) => prev + (curr?.rating ?? 0), 0) / players.length

const allTeams = computed(() => [
  {
    name: PLAYER_TEAM_NAME,
    rating: getTeamAverageRating(Object.values(props.chosenTeam)),
  },
  ...lastSeasonsTeams.value,
])

const results = computed(() => {
  refreshKey.value
  const returnVal: Match[] = []
  allTeams.value.forEach((team: TableTeam) => {
    allTeams.value
      .filter((t) => t !== team)
      .forEach((opponent) => {
        returnVal.push(simulateGame(team, opponent))
      })
  })
  return returnVal
})

const statModifiers: Ref<typeof INITIAL_STAT_MODIFIERS> =
  inject(INJECTABLES.STAT_MODIFIERS) ?? ref(INITIAL_STAT_MODIFIERS)

function simulateGame(
  team1: TableTeam,
  team2: TableTeam,
  allowDraw: boolean | undefined = true,
): Match {
  const winningOdds = parseFloat((team1.rating / team2.rating).toFixed(2))
  const random = parseFloat((Math.random() * 2).toFixed(2))
  const calc = winningOdds - random

  const drawLeeway = allowDraw ? 0.01 : 0

  // tip the favour towards the player
  let bias = 0
  if (team2.name === PLAYER_TEAM_NAME) {
    bias = statModifiers.value.bias
  } else if (team1.name === PLAYER_TEAM_NAME) {
    bias = -statModifiers.value.bias
  }

  let result = 'draw'
  if (calc > bias + drawLeeway) {
    result = team1.name
  } else if (calc < bias - drawLeeway) {
    result = team2.name
  }
  return {
    home: team1.name,
    away: team2.name,
    result: result,
  }
}

const table = computed<
  (TableTeam & { wins: number; draws: number; losses: number; points: number })[]
>(() =>
  allTeams.value
    .map((team) => {
      const teamResults = results.value.filter((r) => r.home === team.name || r.away === team.name)
      const wins = teamResults.filter((r) => r.result === team.name).length
      const draws = teamResults.filter((r) => r.result === 'draw').length
      const losses = teamResults.filter((r) => r.result !== team.name && r.result !== 'draw').length
      return {
        name: team.name,
        rating: team.rating,
        wins,
        draws,
        losses,
        points: wins * 2 + draws,
      }
    })
    .sort((a, b) => b.points - a.points),
)

const playoffs = computed(() => {
  const [first, second, third, fourth, fifth, sixth] = table.value
  if (
    first === undefined ||
    second === undefined ||
    third === undefined ||
    fourth === undefined ||
    fifth === undefined ||
    sixth === undefined
  ) {
    throw new Error('Playoffs incalculable')
  }
  const eliminator1 = simulateGame(third, sixth, false)
  const eliminator1Winner = eliminator1.result === third.name ? third : sixth
  const eliminator2 = simulateGame(fourth, fifth, false)
  const eliminator2Winner = eliminator2.result === fourth.name ? fourth : fifth

  let semiFinal1, semiFinal2, semiFinal1Winner, semiFinal2Winner
  if (eliminator1Winner === third && eliminator2Winner === fourth) {
    semiFinal1 = simulateGame(second, third, false)
    semiFinal2 = simulateGame(first, fourth, false)
    semiFinal1Winner = semiFinal1.result === second.name ? second : third
    semiFinal2Winner = semiFinal2.result === first.name ? first : fourth
  } else if (eliminator1Winner === third && eliminator2Winner === fifth) {
    semiFinal1 = simulateGame(second, third, false)
    semiFinal2 = simulateGame(first, fifth, false)
    semiFinal1Winner = semiFinal1.result === second.name ? second : third
    semiFinal2Winner = semiFinal2.result === first.name ? first : fifth
  } else if (eliminator1Winner === sixth && eliminator2Winner === fourth) {
    semiFinal1 = simulateGame(second, fourth, false)
    semiFinal2 = simulateGame(first, sixth, false)
    semiFinal1Winner = semiFinal1.result === second.name ? second : fourth
    semiFinal2Winner = semiFinal2.result === first.name ? first : sixth
  } else {
    semiFinal1 = simulateGame(second, fifth, false)
    semiFinal2 = simulateGame(first, sixth, false)
    semiFinal1Winner = semiFinal1.result === second.name ? second : fifth
    semiFinal2Winner = semiFinal2.result === first.name ? first : sixth
  }
  const grandFinal = simulateGame(first, semiFinal1Winner, false)
  const grandFinalWinner = grandFinal.result === first.name ? first : semiFinal1Winner
  return {
    eliminator1,
    eliminator1Winner,
    eliminator2,
    eliminator2Winner,
    semiFinal1,
    semiFinal1Winner,
    semiFinal2,
    semiFinal2Winner,
    grandFinalWinner,
    grandFinal,
  }
})
</script>

<template>
  <button @click="refreshKey = new Date()" class="cursor-pointer">Reload</button>
  <div class="flex flex-col gap-2" v-if="false">
    <div
      class="flex flex-row justify-between gap-2"
      v-for="(result, index) in results.filter(
        (r) => r.home === PLAYER_TEAM_NAME || r.away === PLAYER_TEAM_NAME,
      )"
      :key="`${JSON.stringify(result)}-${index}`"
    >
      <span v-text="result.home === PLAYER_TEAM_NAME ? result.away : result.home" class="flex-1" />
      <span
        v-text="
          result.result === PLAYER_TEAM_NAME ? 'WIN' : result.result === 'draw' ? 'DRAW' : 'LOSE'
        "
        class="px-2 py-1"
        :class="{
          'bg-green-500': result.result === PLAYER_TEAM_NAME,
          'bg-red-500 text-white': result.result !== PLAYER_TEAM_NAME && result.result !== 'draw',
          'bg-gray-500 text-white': result.result === 'draw',
        }"
      />
    </div>
  </div>
  <div class="grid grid-cols-6 gap-x-4">
    <span>Team</span>
    <span>Rating</span>
    <span>Wins</span>
    <span>Draws</span>
    <span>Losses</span>
    <span>Points</span>
    <template v-for="row in table" :key="JSON.stringify(row)">
      <span v-text="row.name" />
      <span v-text="row.rating.toFixed(2)" />
      <span v-text="row.wins" />
      <span v-text="row.draws" />
      <span v-text="row.losses" />
      <span v-text="row.points" />
    </template>
  </div>

  <div class="grid grid-cols-3 gap-x-4">
    <span>Eliminator 1</span>
    <span
      v-text="playoffs.eliminator1.home"
      :class="
        playoffs.eliminator1Winner.name === playoffs.eliminator1.home
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span
      v-text="playoffs.eliminator1.away"
      :class="
        playoffs.eliminator1Winner.name === playoffs.eliminator1.away
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span>Eliminator 2</span>
    <span
      v-text="playoffs.eliminator2.home"
      :class="
        playoffs.eliminator2Winner.name === playoffs.eliminator2.home
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span
      v-text="playoffs.eliminator2.away"
      :class="
        playoffs.eliminator2Winner.name === playoffs.eliminator2.away
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span>Semi-Final 1</span>
    <span
      v-text="playoffs.semiFinal1.home"
      :class="
        playoffs.semiFinal1Winner.name === playoffs.semiFinal1.home
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span
      v-text="playoffs.semiFinal1.away"
      :class="
        playoffs.semiFinal1Winner.name === playoffs.semiFinal1.away
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span>Semi-Final 2</span>
    <span
      v-text="playoffs.semiFinal2.home"
      :class="
        playoffs.semiFinal2Winner.name === playoffs.semiFinal2.home
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span
      v-text="playoffs.semiFinal2.away"
      :class="
        playoffs.semiFinal2Winner.name === playoffs.semiFinal2.away
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span>The Grand Final</span>
    <span
      v-text="playoffs.grandFinal.home"
      :class="
        playoffs.grandFinalWinner.name === playoffs.grandFinal.home
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
    <span
      v-text="playoffs.grandFinal.away"
      :class="
        playoffs.grandFinalWinner.name === playoffs.grandFinal.away
          ? 'text-green-500'
          : 'text-red-500'
      "
    />
  </div>

  <div class="overflow-x-scroll">
    <table class="[&_tr>*]:p-2 [&_tr:nth-of-type(2n)]:bg-gray-300 max-w-full">
      <thead>
        <tr>
          <th></th>
          <th v-for="team in allTeams" :key="JSON.stringify(team)" v-text="team.name" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in allTeams" :key="JSON.stringify(team)">
          <td v-text="team.name" class="font-bold" />
          <td v-for="opponent in allTeams" :key="JSON.stringify(team)">
            <span v-if="team.name !== opponent.name">
              {{ results.find((r) => r.home === team.name && r.away === opponent.name)?.result }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
