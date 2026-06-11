import { defineStore } from 'pinia'
import type {
  DreamTeam,
  Player,
  RatedDreamTeamPlayer,
  Season,
  Seasons,
  Team,
  TeamName,
} from '@/types.ts'
import { computed, ref } from 'vue'
import { getRatedPlayers } from '@/util.ts'

export const usePlayersStore = defineStore(
  'players', () => {

    const rawPlayers = ref<Seasons>({});

    const players = computed<Record<Season, Record<TeamName, RatedDreamTeamPlayer[]>>>(() => {
      const ret: Record<Season, Player[]> = {};
      Object.entries(rawPlayers.value).forEach(([season, teams]: [string, Team[]]) => {
        console.table(rawPlayers.value);
        ret[season] =
          rawPlayers
          .value[season]
          ?.map((team: Team) => {
            return {
              ...team,
              players: getRatedPlayers(team, teams.length)
                .map(player => {
                  const dreamTeam = dreamTeams.value[season][player.url];
                  return {
                  ...player,
                    dreamTeam: !! dreamTeam,
                    mos: dreamTeam?.mos ?? false,
                  }
                  }),
              }
              })
          ?? undefined
      })
      return ret;
    })
    const loading = ref(false);
    const dreamTeams = ref<Record<Season, DreamTeam[]>>({})

    const getPlayers = async () => {
      loading.value = true;
      fetch('./data.json')
        .then(response => response.json())
        .then(data => rawPlayers.value = data)
        .finally(() => loading.value = false);
    }

    const getDreamTeams = async () => {
      loading.value = true;
        fetch('./dream-teams.json')
          .then(response => response.json())
          .then(data => dreamTeams.value = data)
    }
    getPlayers();
    getDreamTeams();

    return {
      players,
      dreamTeams,
      loading,
      getPlayers,
      getDreamTeams
    }
});
