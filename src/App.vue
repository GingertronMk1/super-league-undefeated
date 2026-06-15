<script setup lang="ts">
import { provide, ref } from 'vue'
import StatModifiers from '@/components/StatModifiers.vue'
import type { StatModifiers as StatModifiersType } from '@/types'
import { INITIAL_STAT_MODIFIERS } from '@/constants.ts'
import HeadingComponent from '@/components/HeadingComponent.vue'

const modifiers = ref<StatModifiersType>(INITIAL_STAT_MODIFIERS)
provide('statModifiers', modifiers)
</script>

<template>
  <div class="flex flex-col w-[95%] max-w-7xl">
    <HeadingComponent />
    <StatModifiers />
    <RouterView />
  </div>
</template>

<style scoped></style>
