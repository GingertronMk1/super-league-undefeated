<script setup lang="ts">
import type { ChosenTeam, Player, Season, Team, TeamName } from '@/types.ts'
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref } from 'vue'

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
const oppositionsInLeague = computed(() => [...lastSeasonsTeams.value, ...lastSeasonsTeams.value])

type TableTeam = {
  name: string
  rating: number
}

type Match = {
  home: TeamName
  away: TeamName
  result: TeamName | 'draw'
}

const getTeamAverageRating = (players: ({ rating: number } | null)[]): number =>
  players.reduce((prev, curr) => prev + (curr?.rating ?? 0), 0) / players.length

const allTeams = computed(() => [
  {
    name: PLAYER_TEAM_NAME,
    rating: getTeamAverageRating(Object.values(props.chosenTeam)),
  },
  ...lastSeasonsTeams.value,
])

const simulateResults = computed(() => {
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

function simulateGame(team1: TableTeam, team2: TableTeam): Match {
  const winningOdds = parseFloat((team1.rating / team2.rating).toFixed(2))
  const random = parseFloat((Math.random() * 2).toFixed(2))
  const calc = winningOdds - random

  const drawLeeway = 0.01

  let result = 'draw'
  if (calc > drawLeeway) {
    result = team1.name
  } else if (calc < 0 - drawLeeway) {
    result = team2.name
  }
  return {
    home: team1.name,
    away: team2.name,
    result: result,
  }
}

const table = computed(() =>
  allTeams.value
    .map((team) => {
      const results = simulateResults.value.filter(
        (r) => r.home === team.name || r.away === team.name,
      )
      const wins = results.filter((r) => r.result === team.name).length
      const draws = results.filter((r) => r.result === 'draw').length
      const losses = results.filter((r) => r.result !== team.name && r.result !== 'draw').length
      return {
        team: team.name,
        rating: team.rating,
        wins,
        draws,
        losses,
        points: wins * 2 + draws,
      }
    })
    .sort((a, b) => b.points - a.points),
)
</script>

<template>
  <button @click="refreshKey = new Date()">Reload</button>
  <div class="flex flex-col gap-2" v-if="false">
    <div
      class="flex flex-row justify-between gap-2"
      v-for="(result, index) in simulateResults.filter(
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
  <div class="flex flex-col gap-2">
    <div class="grid grid-cols-6 gap-x-4">
      <span>Team</span>
      <span>Rating</span>
      <span>Wins</span>
      <span>Draws</span>
      <span>Losses</span>
      <span>Points</span>
      <template v-for="row in table" :key="JSON.stringify(row)">
        <span v-text="row.team" />
        <span v-text="row.rating.toFixed(2)" />
        <span v-text="row.wins" />
        <span v-text="row.draws" />
        <span v-text="row.losses" />
        <span v-text="row.points" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
