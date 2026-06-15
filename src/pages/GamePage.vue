<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref } from 'vue'
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

function random(list: unknown[]) {
  return list[Math.floor(Math.random() * list.length)]
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
  right_second_rower: null,
  left_second_rower: null,
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
  const addPlayerToTeam = (position: keyof ChosenTeam) =>
    addPlayerAtPosition(player, chosenTeam.value, position)
  let hasAdded = false
  for (const position of player.positions) {
    console.log(position)
    try {
      addPlayerToTeam(position)
      hasAdded = true
      break;
    } catch (e) {
      console.warn(e)
    }
  }
  if (hasAdded) {
    state.value = GAME_STATE.CHOOSING_TEAM
  } else {
    window.alert(`No player slots open for ${player.name}`)
  }
}

const chosenTeamValues = computed<(PlayerToChoose | null)[]>(() => Object.values(chosenTeam.value))

const chooseTeam = function () {
  const season: Season = random(Object.keys(seasons.value)) as Season
  const teams: Team[] | undefined = seasons.value[season]
  if (!teams) {
    throw new Error('Somehow no season')
  }
  const team: Team | undefined = teams[random(Object.keys(teams)) as number]

  if (!team) {
    throw new Error('Somehow no team')
  }
  const newPlayers: PlayerToChoose[] = [...team.players]
    .sort((a, b) => b.rating - a.rating)
    .map(
      (player: FullPlayer): PlayerToChoose => ({
        ...player,
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
              return ['right_second_rower', 'left_second_rower']
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
}

const prettyPrintPosition = (position: keyof ChosenTeam): string =>
  position
    .split('_')
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(' ')
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-2 gap-x-2">
      <div>
        <span v-text="averageRating.toFixed(2)" />
        <div class="flex flex-col">
          <div
            class="flex flex-row gap-2"
            v-for="position in Object.keys(chosenTeam)"
            :key="position"
          >
            <span v-text="prettyPrintPosition(position as keyof ChosenTeam)" class="w-1/3" />
            <template v-if="chosenTeam[position as keyof ChosenTeam] !== null">
              <span v-text="chosenTeam[position as keyof ChosenTeam]?.name" class="flex-1" />
              <span
                v-text="
                  `${chosenTeam[position as keyof ChosenTeam]?.season} ${chosenTeam[position as keyof ChosenTeam]?.team}`
                "
              />
              {{}}
            </template>
            <span v-else class="text-red-500">Unselected</span>
          </div>
        </div>
      </div>
      <button @click="chooseTeam" v-if="state === GAME_STATE.CHOOSING_TEAM">Choose a team</button>
      <div v-else class="flex flex-col gap-2">
        <div class="grid grid-cols-2" v-if="chosen">
          <div v-text="chosen.season" />
          <div v-text="chosen.team.name" />
        </div>
        <div v-if="chosen?.team">
          <ul>
            <li v-for="player in chosen.team.players" :key="player.url">
              <button
                class="grid grid-cols-3 cursor-pointer hover:bg-gray-200 w-full [&>span]:text-left"
                :class="{
                  '[&>span]:cursor-not-allowed [&>span]:line-through': !!chosenTeamValues.find(
                    (p) => p?.url === player.url,
                  ),
                }"
                @click="choosePlayer({ ...player, season: chosen.season, team: chosen.team.name })"
                :disabled="!!chosenTeamValues.find((p) => p?.url === player.url)"
              >
                <span v-text="player.name" />
                <span v-text="player.positions.map((p) => prettyPrintPosition(p)).join(', ')" />
                <span v-text="player.rating.toFixed(0)" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
