<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function getUrl(route: string): string {
  return router.resolve({ name: route }).href
}
</script>

<template>
  <header class="flex flex-row py-2 bg-blue-400">
    <div class="flex flex-row justify-between items-center w-[95%] max-w-7xl mx-auto">
      <h1 class="text-4xl">Super League Draft Game</h1>
      <div class="flex flex-row gap-2 text-2xl *:py-2 *:px-4 *:hover:bg-blue-600">
        <RouterLink :to="getUrl('statistics')">Stats</RouterLink>
        <RouterLink :to="getUrl('game')">Game</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
