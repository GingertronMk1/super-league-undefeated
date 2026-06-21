<script setup lang="ts">
import type { PlayerToChoose } from '@/types.ts'

defineProps<{
  player: PlayerToChoose|null
}>();
</script>

<template>
  <div class="max-w-1/4 min-w-0 flex-1 mx-auto h-12 flex flex-col items-center justify-center bg-blue-30">
    <span  v-text="player?.name ?? '&nbsp;'" />
  </div>
</template>

<style scoped></style>
