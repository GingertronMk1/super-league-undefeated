<script setup lang="ts">
import type { FullPlayer, Position } from '@/types.ts'
import { prettyPrintPositions } from '@/util.ts'

defineProps<{ player: FullPlayer }>()
</script>

<template>
  <tr :title="player.url">
    <td v-text="player.name" />
    <td v-text="prettyPrintPositions(Object.keys(player.positions) as Position[])" />
    <td v-text="player.stats.appearances" />
    <td v-text="player.stats.tries" />
    <td v-text="player.stats.points" />
    <td :class="player.accolades.dreamTeam ? 'bg-green-500' : ''" v-text="player.accolades.dreamTeam ? 'Yes' : 'No'" />
    <td :class="player.accolades.mos ? 'bg-yellow-500' : ''" v-text="player.accolades.mos ? 'Yes' : 'No'" />
    <td :class="player.accolades.lanceTodd ? 'bg-orange-500' : ''" v-text="player.accolades.lanceTodd ? 'Yes' : 'No'" />
    <td v-text="player.rating.toFixed(2)" />
  </tr>
</template>

<style scoped></style>
