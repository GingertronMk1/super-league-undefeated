<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref, watch } from 'vue'
import type {
  ChosenTeam,
  ChosenTeamPosition,
  FullPlayer,
  PlayerToChoose,
  Position,
  Season,
  Team,
  TeamName,
  TeamToChoose,
} from '@/types.ts'
import { APPLIED_ALIASES, DOUBLED_UP_POSITIONS, GAME_STATE } from '@/constants.ts'
import {
  convertDoubledPosition,
  convertDoubledPositions,
  displayPositionToTeamPositions,
  prettyPrintPosition,
} from '@/util.ts'
import GameComponent from '@/components/GameComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
import DraftedTeamComponent from '@/components/draft/DraftedTeamComponent.vue'

function random<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}

const playersStore = usePlayersStore()
const seasons = computed(() => playersStore.seasons)
const chosen = ref<{ season: Season; team: TeamToChoose } | null>(null)
const state = ref<keyof typeof GAME_STATE>(GAME_STATE.CHOOSING_TEAM)
const chosenTeam = ref<ChosenTeam<PlayerToChoose>>({
  fullback: null,
  right_wing: null,
  right_centre: null,
  left_centre: null,
  left_wing: null,
  stand_off: null,
  scrum_half: null,
  right_prop: null,
  hooker: null,
  left_prop: null,
  right_second_row: null,
  left_second_row: null,
  loose_forward: null,
})

const allTeams = computed(() => playersStore.allTeams)

const averageRating = computed(() => {
  return (
    chosenTeamValues.value.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) /
    chosenTeamValues.value.length
  )
})
const addPlayerAtPosition = (player: PlayerToChoose, position: Position) => {
  const positions = DOUBLED_UP_POSITIONS[position] ?? []
  let hasAdded = false
  for (const position of positions) {
    const typedPosition = position as ChosenTeamPosition
    if (chosenTeam.value[typedPosition] === null) {
      chosenTeam.value[typedPosition] = player
      hasAdded = true
      break
    }
  }
  if (!hasAdded) {
    throw new Error('No available position')
  }
  choosingPlayer.value = null
  state.value = GAME_STATE.CHOOSING_TEAM
}

const choosePlayer = (player: PlayerToChoose) => {
  const availablePositions = player.positions.filter(
    (p) => chosenTeam.value[p as ChosenTeamPosition] === null,
  ) as ChosenTeamPosition[]
  const convertedPositions = convertDoubledPositions(availablePositions)
  if (convertedPositions.length === 1) {
    const [availablePosition] = availablePositions
    if (availablePosition === undefined) {
      throw new Error('No available position')
    }
    const convertedPosition = convertDoubledPosition(availablePosition)
    if (convertedPosition === false) {
      throw new Error('No available position')
    }
    addPlayerAtPosition(player, convertedPosition)
  } else {
    choosingPlayer.value = player
  }
}

const chosenTeamValues = computed<(PlayerToChoose | null)[]>(() => Object.values(chosenTeam.value))

function convertTeam(team: Team): TeamToChoose {
  const newPlayers: PlayerToChoose[] = [...team.players]
    .sort((a, b) => b.rating - a.rating)
    .map((player: FullPlayer): PlayerToChoose => {
      const displayPositions = Object.keys(player.positions) as Position[]
      return {
        ...player,
        displayPositions,
        positions: displayPositions.flatMap(displayPositionToTeamPositions),
      }
    })
  return {
    ...team,
    players: newPlayers,
  }
}

const chooseTeam = function () {
  const season: Season = parseInt(random<string>(Object.keys(seasons.value))) as Season
  const teams: Team[] | undefined = seasons.value[season]
  if (!teams) {
    throw new Error('Somehow no season')
  }
  const team: Team | undefined = teams[parseInt(random<string>(Object.keys(teams)))]

  if (!team) {
    throw new Error('Somehow no team')
  }
  chosen.value = {
    season,
    team: convertTeam(team),
  }
  state.value = GAME_STATE.CHOOSING_PLAYER
}

const playerNotAllowed = (player: PlayerToChoose): string | false => {
  if (chosenTeamValues.value.some((p) => p?.url === player.url)) {
    return `${player.name} is already on your team`
  }
  if (
    Object.entries(chosenTeam.value).every(
      ([position, p]) => !(p === null && player.positions.includes(position as ChosenTeamPosition)),
    )
  ) {
    return `There are no positions for ${player.name} on your team`
  }
  return false
}

const positionIsOpen = (position: Position): boolean => {
  const team = chosenTeam.value
  switch (position) {
    case 'FB':
      return team.fullback === null
    case 'W':
      return team.left_wing === null || team.right_wing === null
    case 'C':
      return team.left_centre === null || team.right_centre === null
    case 'FE':
      return team.stand_off === null
    case 'HB':
      return team.scrum_half === null
    case 'FR':
      return team.left_prop === null || team.right_prop === null
    case 'H':
      return team.hooker === null
    case '2R':
      return team.left_second_row === null || team.right_second_row === null
    case 'L':
      return team.loose_forward === null
  }
}

watch(
  () => chosenTeamValues.value,
  (newVal: (PlayerToChoose | null)[]) => {
    if (newVal.filter((p) => p === null).length === 0) {
      state.value = GAME_STATE.PLAYING_GAME
    }
  },
)
watch(
  () => state.value,
  (newVal: keyof typeof GAME_STATE) => {
    if (newVal === GAME_STATE.CHOOSING_TEAM) {
      chooseTeam()
    }
  },
)

const choosingPlayer = ref<PlayerToChoose | null>(null)

function sortByPredicate<T>(
  a: T,
  b: T,
  predicate: (arg0: T) => boolean,
  fallback: (arg0: T, arg1: T) => number,
): number {
  const aPredicate = predicate(a)
  const bPredicate = predicate(b)
  if (aPredicate && !bPredicate) {
    return 1
  } else if (!aPredicate && bPredicate) {
    return -1
  } else {
    return fallback(a, b)
  }
}

const sortPositions = (player: PlayerToChoose) =>
  [...player.displayPositions].sort((a, b) => sortByPredicate(a, b, positionIsOpen, () => 0))

function rerollSeason() {
  if (!chosen.value) {
    return
  }
  const originalSeason = chosen.value.season
  const teamAlias = APPLIED_ALIASES[chosen.value.team.name]
  if (!teamAlias) {
    return
  }
  let validTeams: Record<Season, Team> = {}
  Object.entries(APPLIED_ALIASES)
    .filter(([, alias]) => alias === teamAlias)
    .map(([name]) => name)
    .forEach((name: TeamName) => {
      validTeams = { ...validTeams, ...allTeams.value[name] }
    })
  let newSeason: Season
  do {
    newSeason = parseInt(random(Object.keys(validTeams))) as Season
  } while (newSeason === originalSeason)
  const newTeam = validTeams[newSeason]
  if (!newTeam) {
    throw new Error('Somehow no team')
  }
  chosen.value = {
    season: newSeason,
    team: convertTeam(newTeam),
  }
}

function rerollTeam() {
  if (!chosen.value) {
    return
  }
  const teams: Team[] | undefined = seasons.value[chosen.value.season]
  if (!teams) {
    throw new Error('Somehow no season')
  }
  const team: Team | undefined = teams[parseInt(random<string>(Object.keys(teams)))]

  if (!team) {
    throw new Error('Somehow no team')
  }
  chosen.value.team = convertTeam(team)
}
</script>

<template>
  <div v-if="Object.values(seasons).length === 0">Loading...</div>
  <div v-else class="flex flex-col gap-y-4">
    <!-- POSITION SELECT MODAL -->
    <section
      v-if="choosingPlayer !== null"
      id="modal"
      class="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-50"
    >
      <CardComponent class="w-1/2">
        Choose a position for {{ choosingPlayer.name }}
        <div class="flex flex-col">
          <span
            v-for="position in convertDoubledPositions(
              choosingPlayer.positions as ChosenTeamPosition[],
            ).filter(positionIsOpen)"
            :key="JSON.stringify(position)"
            class="hover:bg-gray-500 cursor-pointer"
            @click="addPlayerAtPosition(choosingPlayer, position)"
            v-text="position ? prettyPrintPosition(position) : ''"
          />
        </div>
      </CardComponent>
    </section>
    <!-- /POSITION SELECT MODAL -->

    <div class="grid grid-cols-2 gap-x-2">
      <DraftedTeamComponent class="mb-auto" :chosen-team="chosenTeam" />
      <CardComponent>
        <button
          v-if="state === GAME_STATE.CHOOSING_TEAM"
          class="cursor-pointer hover:bg-gray-400 w-full h-full rounded-md"
          @click="chooseTeam"
        >
          Choose a team
        </button>
        <div v-else-if="state === GAME_STATE.CHOOSING_PLAYER" class="flex flex-col gap-2">
          <div
            v-if="chosen"
            class="grid grid-cols-2 [&>button]:cursor-pointer [&>button]:hover:bg-grey-500"
          >
            <button @click="rerollSeason()">Reroll season</button>
            <button @click="rerollTeam()">Reroll team</button>
            <div v-text="chosen.season" />
            <div v-text="chosen.team.name" />
          </div>
          <div v-if="chosen?.team">
            <ul>
              <li
                v-for="player in chosen.team.players.sort((a, b) =>
                  sortByPredicate(
                    a,
                    b,
                    (p) => !!playerNotAllowed(p),
                    (a, b) => b.rating - a.rating,
                  ),
                )"
                :key="player.url"
              >
                <button
                  class="cursor-pointer hover:bg-gray-200 w-full *:text-start relative"
                  :class="!!playerNotAllowed(player) ? 'cursor-not-allowed' : 'cursor-pointer'"
                  :disabled="!!playerNotAllowed(player)"
                  @click="
                    choosePlayer({ ...player, season: chosen.season, team: chosen.team.name })
                  "
                >
                  <span
                    v-if="playerNotAllowed(player)"
                    class="absolute inset-0 bg-gray-500/70 flex flex-col justify-center items-center"
                  >
                    {{ playerNotAllowed(player) }}
                  </span>
                  <div
                    class="flex flex-row justify-between gap-x-4"
                    :class="{
                      'opacity-15': !!playerNotAllowed(player),
                    }"
                  >
                    <span class="w-1/3" v-text="player.name" />
                    <div class="flex flex-col flex-1">
                      <span
                        v-for="position in sortPositions(player)"
                        :key="position"
                        :class="!positionIsOpen(position) ? 'line-through' : ''"
                        v-text="prettyPrintPosition(position as Position)"
                      />
                    </div>
                    <span class="w-1/10" v-text="player.rating.toFixed(0)" />
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-else-if="state === GAME_STATE.PLAYING_GAME"
          class="h-full flex flex-col justify-center items-center gap-2"
        >
          <span v-text="`Your team's overall rating is ${averageRating.toFixed(2)}`" />
          <span>Now let's start the season!</span>
        </div>
      </CardComponent>
    </div>

    <template v-if="state === GAME_STATE.PLAYING_GAME">
      <GameComponent :chosen-team="chosenTeam" />
    </template>
  </div>
</template>
