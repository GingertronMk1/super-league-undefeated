<script setup lang="ts">
import { provide, ref } from 'vue'

const modifiers = ref({})
const downTableModifier = ref(2)
const forwardTriesModifier = ref(1)
const baseRate = ref(50)

provide('modifiers', modifiers)
provide('downTableModifier', downTableModifier)
provide('forwardTriesModifier', forwardTriesModifier)
provide('baseRate', baseRate)
</script>

<template>
  <div class="flex flex-col">
    <label for="downTableModifier">
      Down Table Modifier:
      <input
        id="downTableModifier"
        name="downTableModifier"
        v-model="downTableModifier"
        type="number"
        min="1"
        max="100"
        step="1"
      />
    </label>
    <label for="forwardTriesModifier">
      Forward Tries Modifier:
      <input
        id="forwardTriesModifier"
        name="forwardTriesModifier"
        v-model="forwardTriesModifier"
        type="number"
        min="1"
        max="100"
        step="0.1"
    />
    </label>
    <label for="baseRate">
      Base Rate:
      <input
        id="baseRate"
        name="baseRate"
        v-model="baseRate"
        type="number"
        min="1"
        max="100"
        step="1"
      />
    </label>
    <RouterView />
  </div>
</template>

<style scoped></style>
