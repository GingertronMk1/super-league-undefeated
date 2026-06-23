<script setup lang="ts">
import type { ChosenTeam, Match, PlayerToChoose, TableTeam, Team } from '@/types.ts'
import { usePlayersStore } from '@/stores/players.ts'
import { computed, inject, type Ref, ref } from 'vue'
import { INITIAL_STAT_MODIFIERS, INJECTABLES } from '@/constants.ts'
import CardComponent from '@/components/CardComponent.vue'
import PlayoffComponent from '@/components/game/PlayoffComponent.vue'

const props = defineProps<{
  chosenTeam: ChosenTeam<PlayerToChoose>
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
  <CardComponent>
    <h2 class="col-span-full text-3xl font-bold mb-2">The Regular Season</h2>
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
    <h2 class="col-span-full text-3xl font-bold mb-2">The Playoffs</h2>
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
          <th></th>
          <th v-for="team in allTeams" :key="JSON.stringify(team)" v-text="team.name" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in allTeams" :key="JSON.stringify(team)">
          <td v-text="team.name" class="font-bold" />
          <td v-for="opponent in allTeams" :key="JSON.stringify({ team, opponent })">
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
