<script setup lang="ts">
import { usePlayersStore } from '@/stores/players.ts';
import { computed } from 'vue';
import type {
  Accolades,
  FullPlayer,
  PlayerTeam,
  PlayerWithTeams,
  PlayerWithTeamsList,
  Season,
} from '@/types.ts';
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts';
import CardComponent from '@/components/CardComponent.vue';
import { prettyPrintAccolade, prettyPrintAccolades } from '@/util.ts';

const { mean } = useStatisticalMethods();
const playersStore = usePlayersStore();

const playersWithTeamsLists = computed<PlayerWithTeamsList>(() => playersStore.groupedPlayers);

const weightedRating = (teams: PlayerTeam[]): number =>
  mean(teams.map((t) => t.rating)) * Math.pow(teams.length, 1 / 3);

const playerDetail = function ({ name, teams }: PlayerWithTeams): string {
  const seasons = teams.length === 1 ? '1 season' : `${teams.length} seasons`;
  const rating = weightedRating(teams).toFixed(2);
  return `${name} - weighted average ${rating} over ${seasons}`;
};
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <CardComponent
      v-for="player in playersWithTeamsLists.sort((a, b) => weightedRating(b.teams) - weightedRating(a.teams))"
      :key="player.url"
      class="flex flex-col items-stretch"
    >
      <h2
        class="text-xl"
        v-text="playerDetail(player)"
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
            <td class="flex flex-col items-start">
              <template
                v-for="(has, accolade) in team.accolades"
                :key="accolade"
              >
                <span
                  v-if="has"
                  v-text="prettyPrintAccolade(accolade)"
                />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </CardComponent>
  </div>
</template>

<style scoped></style>
