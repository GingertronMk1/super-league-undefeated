<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts'
import { computed, ref } from 'vue'

const playersStore = usePlayersStore()
const players = computed(() => playersStore.players)
const chosenTeam = ref(null)
const draftedTeam = ref({})
</script>

<template>
</template>

<style scoped></style>
