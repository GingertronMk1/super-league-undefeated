<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref, watch } from 'vue'
import type {
  ChosenTeam,
  FullPlayer,
  PlayerToChoose,
  Position,
  Season,
  Team,
  TeamToChoose,
} from '@/types.ts'
import { GAME_STATE } from '@/constants.ts'
import { prettyPrintPosition } from '@/util.ts'
import GameComponent from '@/components/GameComponent.vue'
import CardComponent from '@/components/CardComponent.vue'

function random<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}

const playersStore = usePlayersStore()
const seasons = computed(() => playersStore.seasons)
const chosen = ref<{ season: Season; team: TeamToChoose } | null>(null)
const state = ref<keyof typeof GAME_STATE>(GAME_STATE.CHOOSING_TEAM)
const chosenTeam = ref<ChosenTeam>({
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

const averageRating = computed(() => {
  return (
    chosenTeamValues.value.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) /
    chosenTeamValues.value.length
  )
})
const addPlayerAtPosition = (
  player: PlayerToChoose,
  team: ChosenTeam,
  position: keyof ChosenTeam,
) => {
  if (team[position] !== null) {
    throw new Error('Cannot add at that position')
  }
  team[position] = player
}

const choosePlayer = (player: PlayerToChoose) => {
  const addPosition = player.positions.filter((p) => chosenTeam.value[p] === null)[0]
  if (!addPosition) {
    throw new Error('No position to add player to')
  }
  addPlayerAtPosition(player, chosenTeam.value, addPosition);
  state.value = GAME_STATE.CHOOSING_TEAM
}

const chosenTeamValues = computed<(PlayerToChoose | null)[]>(() => Object.values(chosenTeam.value))

const chooseTeam = function () {
  try {
    const season: Season = parseInt(random<string>(Object.keys(seasons.value))) as Season
    const teams: Team[] | undefined = seasons.value[season]
    if (!teams) {
      throw new Error('Somehow no season')
    }
    const team: Team | undefined = teams[parseInt(random<string>(Object.keys(teams)))]

    if (!team) {
      throw new Error('Somehow no team')
    }
    const newPlayers: PlayerToChoose[] = [...team.players]
      .sort((a, b) => b.rating - a.rating)
      .map(
        (player: FullPlayer): PlayerToChoose => ({
          ...player,
          displayPositions: player.positions,
          positions: player.positions.flatMap((position: Position): (keyof ChosenTeam)[] => {
            switch (position) {
              case 'FB':
                return ['fullback']
              case 'W':
                return ['right_wing', 'left_wing']
              case 'C':
                return ['right_centre', 'left_centre']
              case 'FE':
                return ['stand_off']
              case 'HB':
                return ['scrum_half']
              case 'FR':
                return ['right_prop', 'left_prop']
              case '2R':
                return ['right_second_row', 'left_second_row']
              case 'H':
                return ['hooker']
              case 'L':
                return ['loose_forward']
              default:
                throw new Error('Invalid position')
            }
          }),
        }),
      )
    const newTeam: TeamToChoose = {
      ...team,
      players: newPlayers,
    }
    chosen.value = {
      season,
      team: newTeam,
    }
    state.value = GAME_STATE.CHOOSING_PLAYER
  } catch (e) {
    throw e
  } finally {
  }
}

const playerNotAllowed = (player: PlayerToChoose): string | false => {
  if (chosenTeamValues.value.some((p) => p?.url === player.url)) {
    return `${player.name} is already on your team`
  }
  if (
    Object.entries(chosenTeam.value).every(
      ([position, p]) => !(p === null && player.positions.includes(position as keyof ChosenTeam)),
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
      chooseTeam();
    }
  }
)

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
</script>

<template>
  <div v-if="Object.values(seasons).length === 0">Loading...</div>
  <div class="flex flex-col gap-y-4" v-else>
    <div class="grid grid-cols-2 gap-x-2">
      <CardComponent class="mb-auto">
        <span v-text="averageRating.toFixed(2)" />
        <div class="flex flex-col">
          <div
            class="flex flex-row gap-2"
            v-for="(position, index) in Object.keys(chosenTeam)"
            :key="position"
          >
            <span v-text="index + 1" class="w-1/10" />
            <template v-if="chosenTeam[position as keyof ChosenTeam] !== null">
              <span v-text="chosenTeam[position as keyof ChosenTeam]?.name" class="flex-1" />
              <span
                v-text="
                  `${chosenTeam[position as keyof ChosenTeam]?.season} ${chosenTeam[position as keyof ChosenTeam]?.team}`
                "
                class="w-2/5 text-end"
              />
            </template>
            <span v-else class="text-red-500">Unselected</span>
          </div>
        </div>
      </CardComponent>
      <CardComponent>
        <button
          @click="chooseTeam"
          v-if="state === GAME_STATE.CHOOSING_TEAM"
          class="cursor-pointer hover:bg-gray-400 w-full h-full rounded-md"
        >
          Choose a team
        </button>
        <div v-else-if="state === GAME_STATE.CHOOSING_PLAYER" class="flex flex-col gap-2">
          <div class="grid grid-cols-2" v-if="chosen">
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
                  @click="
                    choosePlayer({ ...player, season: chosen.season, team: chosen.team.name })
                  "
                  :disabled="!!playerNotAllowed(player)"
                >
                  <span
                    v-if="playerNotAllowed(player)"
                    class="absolute inset-0 bg-gray-500/70 flex flex-col justify-center items-center"
                  >
                    {{ playerNotAllowed(player) }}
                  </span>
                  <div
                    class="flex flex-row justify-between"
                    :class="{
                      'opacity-15': !!playerNotAllowed(player),
                    }"
                  >
                    <span v-text="player.name" class="w-1/3" />
                    <div class="flex flex-col flex-1">
                      <span
                        v-for="position in sortPositions(player)"
                        :key="position"
                        :class="!positionIsOpen(position) ? 'line-through' : ''"
                        v-text="prettyPrintPosition(position as Position)"
                      />
                    </div>
                    <span v-text="player.rating.toFixed(0)" class="w-1/10" />
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
      <GameComponent :chosenTeam="chosenTeam" />
    </template>
  </div>
</template>
