import { defineStore } from 'pinia'
import type { Seasons } from '@/types.ts'
import { ref } from 'vue'

export const usePlayersStore = defineStore(
  'players', () => {

    const players = ref<Seasons>({});
    const loading = ref(false);

    const getPlayers = async () => {
      loading.value = true;
      fetch('./data.json')
        .then(response => response.json())
        .then(data => players.value = data)
        .finally(() => loading.value = false);
    }
    getPlayers();

    return { players, getPlayers, loading }
})
