import { defineStore } from 'pinia'
import type {
  DreamTeam,
  DreamTeamPlayer,
  BasePlayer,
  Player,
  Season,
  Seasons,
  BaseTeam,
  Team,
} from '@/types.ts'
import { computed, ref } from 'vue'
import { getPlayerRating } from '@/util.ts'

export const usePlayersStore = defineStore(
  'players', () => {

    const rawPlayers = ref<Seasons>({});
    const loading = ref(false)
    const dreamTeams = ref<{ [key: Season]: DreamTeam }>({})

    const seasons = computed<{ [key: Season]: Team[]}>(() => {
      // Create a value to return
      const returnVal: Record<Season, Team[]> = {};

      // Take the players we get from JSON
      Object.entries(rawPlayers.value).forEach(function ([season, teams]) {
        const seasonNumber = parseInt(season) as Season;
        const dreamTeamOfSeason: DreamTeam = dreamTeams.value[seasonNumber] ?? {};

        // Convert the players into the accoladed, rated versions
        // By cross-referencing the dream teams JSON file
        returnVal[seasonNumber] = teams.map((team: BaseTeam): Team  => ({
            ...team,
            players: team.players.map(function (player: BasePlayer) {
              const dreamTeamPlayer: DreamTeamPlayer|undefined = dreamTeamOfSeason[player.url];
              const accoladePlayer: Player = {
                ...player,
                dreamTeam: !!dreamTeamPlayer,
                mos: dreamTeamPlayer?.mos ?? false,
                rating: 0,
              }
              accoladePlayer.rating = getPlayerRating(accoladePlayer, team, teams.length)
              return accoladePlayer;
            })
          }
        ))
      })
      return returnVal;
    })

    const allPlayers = computed(() => {
      return Object.entries(seasons.value)
        .flatMap(([season, teams]) => teams
          .flatMap(team => team.players
            .map(player => ({
              ...player,
              season,
              team: team.name
      }))))
    })
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
      seasons,
      allPlayers,
      dreamTeams,
      loading,
      getPlayers,
      getDreamTeams
    }
});
