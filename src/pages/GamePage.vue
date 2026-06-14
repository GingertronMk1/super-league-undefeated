<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref } from 'vue'
import type { ChosenTeam, FullPlayer, Position, Season, Team } from '@/types.ts'
import { GAME_STATE } from '@/constants.ts'

function random(list: unknown[]) {
  return list[Math.floor(Math.random() * list.length)]
}

const playersStore = usePlayersStore()
const seasons = computed(() => playersStore.seasons)
const chosen = ref<{ season: Season; team: Team } | null>(null)
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

const addPlayerAtPosition = (player: FullPlayer, team: ChosenTeam, position: keyof ChosenTeam) => {
  if (team[position] !== null) {
    throw new Error('Cannot add at that position')
  }
  team[position] = player
}

const choosePlayer = (player: FullPlayer) => {
  const position: Position | undefined = player.positions[0]
  if (!position) {
    throw new Error('Player is without any positions')
  }
  const addPlayerToTeam = (position: keyof ChosenTeam) =>
    addPlayerAtPosition(player, chosenTeam.value, position)
  switch (position) {
    case 'FB':
      addPlayerToTeam('fullback')
      break
    case 'W':
      try {
        addPlayerToTeam('right_wing')
        break
      } catch (_) {
        addPlayerToTeam('left_wing')
        break
      }
    case 'C':
      try {
        addPlayerToTeam('right_centre')
        break
      } catch (_) {
        addPlayerToTeam('left_centre')
        break
      }
    case 'FE':
      addPlayerToTeam('stand_off')
      break
    case 'HB':
      addPlayerToTeam('scrum_half')
      break
    case 'FR':
      try {
        addPlayerToTeam('right_prop')
        break
      } catch (_) {
        addPlayerToTeam('left_prop')
        break
      }
    case 'H':
      addPlayerToTeam('hooker')
      break
    case '2R':
      try {
        addPlayerToTeam('right_second_rower')
        break
      } catch (_) {
        addPlayerToTeam('left_second_rower')
        break
      }
    case 'L':
      addPlayerToTeam('loose_forward')
      break
  }
  state.value = GAME_STATE.CHOOSING_TEAM
}

const fullTeam = computed(
  () => ({
      keys: Object .keys(chosenTeam.value).length ,
      values: Object.values(chosenTeam.value).filter((v) => v !== null).length,
}))

const avgRating = computed(() => {
  const vals = Object.values(chosenTeam.value);
  return vals.reduce((prev, curr) => prev + (curr?.rating ?? 0), 0) / vals.length
})

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
  chosen.value = {
    season,
    team: {
      ...team,
      players: [...team.players].sort((a, b) => b.rating - a.rating),
    },
  }
  state.value = GAME_STATE.CHOOSING_PLAYER
}
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-2">
      <div>
        {{ fullTeam }}
        {{ avgRating }}
        <ul>
          <li v-for="key in Object.keys(chosenTeam)" :key="key">
            <span v-if="chosenTeam[key as keyof ChosenTeam] !== null" v-text="chosenTeam[key as keyof ChosenTeam]?.name" />
            <span v-else>Unselected</span>
          </li>
        </ul>
      </div>
      <button @click="chooseTeam" v-if="state === GAME_STATE.CHOOSING_TEAM">Choose a team</button>
      <div v-else class="flex flex-col gap-2">
        <div class="grid grid-cols-2" v-if="chosen">
          <div v-text="chosen.season" />
          <div v-text="chosen.team.name" />
        </div>
        <div v-if="chosen?.team">
          <ul>
            <li
              v-for="player in chosen.team.players"
              :key="player.url"
              class="grid grid-cols-3 cursor-pointer hover:bg-gray-200"
              @click="choosePlayer({ ...player, season: chosen.season, team: chosen.team.name })"
            >
              <span v-text="player.name" />
              <span v-text="player.positions.join(', ')" />
              <span v-text="player.rating.toFixed(0)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
