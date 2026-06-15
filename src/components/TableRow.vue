<script setup lang="ts">
import type { FullPlayer } from '@/types.ts'
import { prettyPrintPositions } from '@/util.ts'

defineProps<{ player: FullPlayer }>()
</script>

<template>
  <tr :title="player.url">
    <td v-text="player.name" />
    <td v-text="prettyPrintPositions(player.positions)" />
    <td v-text="player.stats.appearances" />
    <td v-text="player.stats.tries" />
    <td v-text="player.stats.points" />
    <td v-text="player.dreamTeam ? 'Yes' : 'No'" :class="player.dreamTeam ? 'bg-green-500' : ''" />
    <td v-text="player.mos ? 'Yes' : 'No'" :class="player.mos ? 'bg-yellow-500' : ''" />
    <td v-text="player.lanceTodd ? 'Yes' : 'No'" :class="player.lanceTodd ? 'bg-orange-500' : ''" />
    <td v-text="player.rating.toFixed(2)" />
  </tr>
</template>

<style scoped></style>
