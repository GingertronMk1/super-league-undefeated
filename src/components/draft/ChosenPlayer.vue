<script setup lang="ts">
import type { PlayerToChoose } from '@/types.ts'
import CardComponent from '@/components/CardComponent.vue'

defineProps<{
  player: PlayerToChoose | null
  squadNumber: string
}>()
</script>

<template>
  <CardComponent
    class="aspect-square max-w-1/4 min-w-0 flex-1 flex flex-col items-center justify-center gap-1 border-2 border-gray-400"
  >
    <span v-if="!player" class="text-4xl" v-text="squadNumber + '.'" />
    <template v-else>
      <span class="text-sm" v-text="squadNumber + '.'" />
      <span class="text-lg" v-text="player.name" />
      <span class="text-xs" v-text="`${player.season} ${player.team}`" />
    </template>
  </CardComponent>
</template>

<style scoped></style>
