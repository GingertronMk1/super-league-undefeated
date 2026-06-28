<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import StatModifiers from '@/components/StatModifiers.vue';
import type { StatModifiers as StatModifiersType } from '@/types';
import { INITIAL_STAT_MODIFIERS, INJECTABLES } from '@/constants.ts';
import HeadingComponent from '@/components/HeadingComponent.vue';
import { usePlayersStore } from '@/stores/players.ts';

const modifiers = ref<StatModifiersType>(INITIAL_STAT_MODIFIERS);
provide(INJECTABLES.STAT_MODIFIERS, modifiers);
const title = document.querySelector('title');
if (title) {
  title.innerText = 'Super League Draft Game';
}

const playersStore = usePlayersStore();
const playersStoreLoading = computed(() => playersStore.loading);
const isDev = computed(() => import.meta.env.DEV);
</script>

<template>
  <div
    v-if="playersStoreLoading"
    class="mx-auto p-16 my-auto text-3xl"
  >
    Loading Players...
  </div>
  <template v-else>
    <HeadingComponent />
    <div class="flex flex-col w-[95%] max-w-7xl mx-auto py-4">
      <StatModifiers v-if="isDev" />
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
