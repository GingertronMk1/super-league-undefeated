<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
function getUrl(route: string): string {
  return router.resolve({ name: route }).href;
}

const links = [
  {
    url: router.resolve({ name: 'statistics' }),
    text: 'Stats',
  },
  {
    url: router.resolve({ name: 'allPlayers' }),
    text: 'All Players',
  },
  {
    url: router.resolve({ name: 'game' }),
    text: 'Game',
  },
];
</script>

<template>
  <header class="flex flex-row py-2 bg-blue-400">
    <div class="flex flex-row justify-between items-center w-[95%] max-w-7xl mx-auto">
      <h1 class="text-4xl">
        Super League Draft Game
      </h1>
      <div class="flex flex-row gap-2 text-2xl">
        <RouterLink
          v-for="link in links"
          :key="JSON.stringify(link)"
          class="py-2 px-4 hover:bg-blue-600"
          :to="link.url"
        >
          {{ link.text }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
