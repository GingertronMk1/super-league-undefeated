<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts';
import { computed } from 'vue';
import type { Accolades, FullPlayer, PlayerWithTeamsList, Season } from '@/types.ts';
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts';
import CardComponent from '@/components/CardComponent.vue';
import { prettyPrintAccolades } from '@/util.ts';

const { mean } = useStatisticalMethods();
const playersStore = usePlayersStore();
const seasons = computed(() => playersStore.seasons);

const playersWithTeamsLists = computed<PlayerWithTeamsList>(function () {
  let ret: PlayerWithTeamsList = [];
  Object.entries(seasons.value).forEach(function ([season, teams]) {
    teams.forEach(function (team) {
      team.players.forEach(function (player: FullPlayer) {
        let currentPlayer = ret.find((p) => p.url === player.url);
        if (currentPlayer === undefined) {
          currentPlayer = {
            name: player.name,
            teams: [],
            url: player.url,
          };
        }
        currentPlayer.teams.push({
          accolades: player.accolades,
          positions: player.positions,
          rating: player.rating,
          ratings_stats: player.ratings,
          team_champions: team.champions,
          team_finish: team.finish,
          team_name: team.name,
          season: parseInt(season) as Season,
        });
        ret = [...ret.filter((p) => p.url !== player.url), currentPlayer];
      });
    });
  });
  return ret.sort((a, b) => mean(b.teams.map((t) => t.rating)) - mean(a.teams.map((t) => t.rating)));
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <CardComponent
      v-for="player in playersWithTeamsLists"
      :key="player.url"
      class="flex flex-col items-stretch"
    >
      <h2
        class="text-xl"
        v-text="player.name"
      />

      <table>
        <thead>
          <tr class="*:w-1/5">
            <th>Season</th>
            <th>Team</th>
            <th>Rating</th>
            <th>Positions</th>
            <th>Accolades</th>
          </tr>
        </thead>
        <tbody class="[&>tr:nth-child(2n)]:bg-gray-200">
          <tr
            v-for="team in player.teams"
            :key="team.season + team.team_name"
          >
            <td v-text="team.season" />
            <td v-text="team.team_name" />
            <td v-text="team.rating.toFixed(2)" />
            <td
              v-text="
                Object.entries(team.positions)
                  .map(([position, count]) => `${position} x${count}`)
                  .join(', ')
              "
            />
            <td v-text="prettyPrintAccolades(team.accolades)" />
          </tr>
        </tbody>
      </table>
    </CardComponent>
  </div>
</template>

<style scoped></style>
