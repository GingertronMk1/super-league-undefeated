<script setup lang="ts">
import { provide, ref } from 'vue'
import StatModifiers from '@/components/StatModifiers.vue'
import type { StatModifiers as StatModifiersType } from '@/types'
import { INITIAL_STAT_MODIFIERS, INJECTABLES } from '@/constants.ts'
import HeadingComponent from '@/components/HeadingComponent.vue'

const modifiers = ref<StatModifiersType>(INITIAL_STAT_MODIFIERS)
provide(INJECTABLES.STAT_MODIFIERS, modifiers)
</script>

<template>
  <HeadingComponent />
  <div class="flex flex-col w-[95%] max-w-7xl mx-auto py-4">
    <StatModifiers />
    <RouterView />
  </div>
</template>

<style scoped></style>
