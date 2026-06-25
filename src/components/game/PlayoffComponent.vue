<script setup lang="ts">
import type { Match, TableTeam } from '@/types.ts';

defineProps<{
  title: string
  match: Match
  winner: TableTeam
}>();
</script>

<template>
  <div class="grid grid-cols-3 gap-x-4">
    <span v-text="title" />
    <span
      :class="winner.name === match.home ? 'text-green-500' : 'text-red-500'"
      v-text="match.home"
    />
    <span
      :class="winner.name === match.away ? 'text-green-500' : 'text-red-500'"
      v-text="match.away"
    />
  </div>
</template>
