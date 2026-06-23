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
    class="aspect-square max-w-1/4 min-w-0 flex-1 flex flex-row items-center justify-center gap-1 border-2 border-gray-400"
  >
    <span v-if="!player" class="text-4xl" v-text="squadNumber + '.'" />
    <template v-else>
      <span class="text-xl" v-text="squadNumber + '.'" />
      <span v-text="player.name" />
    </template>
  </CardComponent>
</template>

<style scoped></style>
