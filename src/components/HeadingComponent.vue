<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function getUrl(route: string): string {
  return router.resolve({ name: route }).href
}
</script>

<template>
  <header class="flex flex-row justify-between">
    <div class="flex flex-row gap-2">
      <RouterLink :to="getUrl('statistics')">Stats</RouterLink>
      <RouterLink :to="getUrl('game')">Game</RouterLink>
    </div>
  </header>
</template>

<style scoped></style>
