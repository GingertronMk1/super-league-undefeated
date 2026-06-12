<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import type { StatModifiers } from '@/types'

const modifiers = inject<Ref<StatModifiers>>('statModifiers')
const showModifiers = ref(true)
const showJSON = ref(false)
</script>

<template>
  <div
    class="flex flex-col items-stretch fixed bottom-0 right-0 bg-red-500 text-white p-2 gap-2 [&>label]:flex [&>label]:flex-row [&>label]:items-center [&>label]:gap-2 [&>label>input]:flex-1 [&>label>input]:bg-red-400"
    v-if="modifiers"
  >
    <button @click="showModifiers = !showModifiers" v-text="`${showModifiers ? 'Hide' : 'Show'} Modifiers`" />
    <template v-if="showModifiers">
      <label v-for="modifier in Object.keys(modifiers)" :key="modifier" :for="modifier">
        {{ modifier }}:
        <input
          :id="modifier"
          :name="modifier"
          v-model="modifiers[modifier as keyof StatModifiers]"
          type="number"
          min="1"
          max="100"
          step="0.01"
        />
      </label>
      <button @click="showJSON = !showJSON" v-text="`${showJSON ? 'Hide' : 'Show'} JSON`" />
      <pre v-if="showJSON" v-html="JSON.stringify(modifiers, null, 2)" />
    </template>
  </div>
</template>

<style scoped></style>
