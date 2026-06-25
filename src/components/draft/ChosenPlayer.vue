<script setup lang="ts">
import type { ChosenTeam, ChosenTeamPosition, PlayerToChoose } from '@/types.ts';
import CardComponent from '@/components/CardComponent.vue';
import { computed } from 'vue';

const props = defineProps<{
  team: ChosenTeam<PlayerToChoose>
  squadNumber: string
  choosingPlayer: PlayerToChoose | null
  position: ChosenTeamPosition
}>();

const player = computed(() => props.team[props.position]);
const highlightBackground = computed(() => {
  if (!props.choosingPlayer) {
    return '';
  }
  return props.choosingPlayer.positions.includes(props.position) && player.value === null
    ? 'bg-orange-500! hover:bg-orange-600! cursor-pointer'
    : 'cursor-not-allowed';
});

const emit = defineEmits(['position-selected']);
const handleEmit = () => emit('position-selected', props.position);
</script>

<template>
  <CardComponent
    class="aspect-square max-w-1/4 min-w-0 flex-1 flex flex-col items-center justify-between gap-1 border-2 border-gray-400 text-center"
    :class="highlightBackground"
    @click="handleEmit"
  >
    <span
      v-if="!player"
      class="text-4xl my-auto"
      v-text="squadNumber + '.'"
    />
    <template v-else>
      <div class="flex flex-row justify-between w-full">
        <span
          class="text-sm"
          v-text="squadNumber + '.'"
        />
        <span
          class="text-sm"
          v-text="Math.round(player.rating)"
        />
      </div>
      <span
        class="text-lg"
        v-text="player.name"
      />
      <span
        class="text-xs"
        v-text="`${player.season} ${player.team}`"
      />
    </template>
  </CardComponent>
</template>

<style scoped></style>
