<script setup lang="ts">
import type { ChosenTeam, ChosenTeamPosition, PlayerToChoose } from '@/types.ts';
import CardComponent from '@/components/CardComponent.vue';
import { computed } from 'vue';

const props = defineProps<{
  team: ChosenTeam<PlayerToChoose>
  squadNumber: string
  choosingPlayer: PlayerToChoose | null
  position: ChosenTeamPosition
  dragPositions: ChosenTeamPosition[]
}>();

const emit = defineEmits(['position-selected', 'position-change-started', 'position-changed']);
const player = computed(() => props.team[props.position]);

const DATA_TRANSFER_NAME = 'MOVE_PLAYER_URL';
const handleEmit = () => emit('position-selected', props.position);
const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer || !player.value) {
    return;
  }
  event.dataTransfer.clearData();
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData(DATA_TRANSFER_NAME, props.position);
  emit('position-change-started', player.value.positions);
};

const handleDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) {
    // return;
  }
  event.preventDefault();
  return false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (!event.dataTransfer) {
    return;
  }
  const oldPosition = event.dataTransfer.getData(DATA_TRANSFER_NAME);

  emit('position-changed', {
    oldPosition,
    newPosition: props.position,
  });
  return false;
};
const canDrag = computed(
  () => {
    const positions = player.value?.positions ?? [];
    return positions.length > 1 &&
    positions.filter((p) => p !== props.position).some((p) => props.team[p] === null);
  }
);
</script>

<template>
  <CardComponent
    class="aspect-square max-w-1/4 min-w-0 flex-1 flex flex-col items-center justify-between gap-1 border-2 border-gray-400 text-center"
    :class="{
      'bg-orange-500! hover:bg-orange-600! cursor-pointer':
        player === null && choosingPlayer !== null && choosingPlayer.positions.includes(position),
      'bg-orange-500!': dragPositions.includes(position),
      'cursor-grab': canDrag,
    }"
    :draggable="canDrag"
    @click="handleEmit"
    @dragstart="handleDragStart($event)"
    @dragover="handleDragOver($event)"
    @drop="handleDrop"
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
