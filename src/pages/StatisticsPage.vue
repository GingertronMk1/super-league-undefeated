<script setup lang="ts">
import { computed } from 'vue';
import type { FullPlayer, Position, Season, Team } from '@/types';
import { usePlayersStore } from '@/stores/players';
import {
  generateBestPossibleTeam,
  getMostFrequentPosition,
  isForward,
  prettyPrintAccolades,
  prettyPrintPositions,
  sortByLastName,
} from '@/util';
import TableRow from '@/components/TableRow.vue';
import CardComponent from '@/components/CardComponent.vue';
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts';

const playersStore = usePlayersStore();
const players = computed(() => playersStore.seasons);

const { mean } = useStatisticalMethods();

const seasons = computed<Record<Season, Team[]>>(() => playersStore.seasons);

const allPlayers = computed<FullPlayer[]>(() => playersStore.allPlayers);
const bestAndWorst = computed(() => playersStore.bestAndWorst);

const bestTeam = computed(() => {
  const [fb] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'FB');
  const [
    w1,
    w2,
  ] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'W');
  const [
    c1,
    c2,
  ] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'C');
  const [so] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'FE');
  const [sh] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'HB');
  const [
    p1,
    p2,
  ] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'FR');
  const [h] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'H');
  const [
    sr1,
    sr2,
  ] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === '2R');
  const [lf] = allPlayers.value.filter(p => getMostFrequentPosition(p.positions) === 'L');
  return [
    fb,
    w1,
    c1,
    c2,
    w2,
    so,
    sh,
    p1,
    h,
    p2,
    sr1,
    sr2,
    lf,
  ];
});

const numbers = computed(() => {
  const seasonCount = Object.keys(players.value).length;
  const teamCount = Object.values(players.value).reduce(
    (acc, season) => acc + season.length,
    0,
  );
  const playerCount = Object.values(players.value).reduce(
    (acc, season) => acc + season.reduce(
      (acc, team) => acc + team.players.length,
      0,
    ),
    0,
  );
  return { seasonCount,
    teamCount,
    playerCount };
});

const club100 = computed(() => [...allPlayers.value]
  .filter(({ rating }) => rating === (bestAndWorst.value.best?.rating ?? 100))
  .sort(sortByLastName));

const getTeamAverageRating = (team: Team): number => team.players.reduce(
  (prev, curr) => prev + curr.rating,
  0,
) / team.players.length;
</script>

<template>
  <div
    class="flex flex-col [&_table_tr>*]:p-2 [&_table_tbody_tr:nth-child(2n)]:bg-gray-300 [&_h3]:text-lg [&_h2]:text-xl [&_h1,h2,h3]:font-bold space-y-4"
  >
    <h2 v-if="playersStore.loading">
      Loading...
    </h2>
    <template v-else>
      <section>
        <h2>{{ numbers.seasonCount }} seasons</h2>
        <h2>{{ numbers.teamCount }} teams</h2>
        <h2>{{ numbers.playerCount }} players</h2>
      </section>
    </template>
    <CardComponent>
      <div
        v-if="bestAndWorst.best"
        class="relative w-full min-h-100 bg-blue-200"
      >
        <i
          v-for="(player, index) in allPlayers"
          :key="index"
          class="w-1 h-1 absolute -translate-0.5"
          :class="{
            'bg-yellow-500 z-1000': player.accolades.mos,
            'bg-green-500 z-100': !player.accolades.mos && player.accolades.dreamTeam,
            'bg-red-500 z-1': !(player.accolades.mos || player.accolades.dreamTeam),
          }"
          :style="{
            left: `calc(5% + ${(index / allPlayers.length) * 90}%)`,
            bottom: `calc(5% + ${player.rating * 0.9}%)`,
          }"
          :title="`${player.season} ${player.name} ${player.rating.toFixed(2)}`"
        />
      </div>
    </CardComponent>
    <CardComponent>
      <h2>Club {{ bestAndWorst.best?.rating ?? 100 }}</h2>
      <table class="w-full">
        <thead>
          <tr>
            <th>Year</th>
            <th>Player</th>
            <th>Positions</th>
            <th>Accolade?</th>
            <th>Forward?</th>
            <th>Tries</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="player in club100"
            :key="JSON.stringify(player)"
          >
            <td v-text="`${player.season} ${player.team}`" />
            <td v-text="player.name" />
            <td v-text="prettyPrintPositions(Object.keys(player.positions) as Position[])" />
            <td v-text="prettyPrintAccolades(player.accolades)" />
            <td
              :class="{
                'bg-green-500': isForward(player),
                'bg-red-500': !isForward(player),
              }"
            >
              {{ isForward(player) ? 'Yes' : 'No' }}
            </td>

            <td v-text="`${player.stats.tries}`" />
            <td>
              <span v-text="player.rating.toFixed(2)" />
            </td>
          </tr>
        </tbody>
      </table>
    </CardComponent>

    <CardComponent>
      <h2>Best Team Ever</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Year</th>
            <th>Player</th>
            <th>Accolades</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="player in bestTeam"
            :key="JSON.stringify(player)"
          >
            <tr v-if="player">
              <td v-text="getMostFrequentPosition(player.positions)" />
              <td v-text="player.season" />
              <td v-text="player.name" />
              <td v-text="prettyPrintAccolades(player.accolades)" />
              <td>
                <span v-text="player.rating.toFixed(2)" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </CardComponent>
    <CardComponent>
      <ul>
        <li
          v-for="(teams, year) in seasons"
          :key="year"
        >
          <a
            :href="`#year-${year}`"
            class="px-2 py-1 hover:bg-gray-200"
            v-text="year"
          />
          <ul class="pl-4">
            <li
              v-for="team in teams"
              :key="team.name"
            >
              <a
                :href="`#year-${year}-team-${team.name}`"
                class="px-2 py-1 hover:bg-gray-200"
                v-text="`${team.name} - ${getTeamAverageRating(team).toFixed(2)}`"
              />
            </li>
          </ul>
        </li>
      </ul>
    </CardComponent>

    <!-- TEAMS AND YEARS -->
    <CardComponent class="divide-y-2 divide-gray-300">
      <CardComponent
        v-for="(teams, year) in seasons"
        :id="`${year}`"
        :key="year"
        class="flex flex-col gap-4"
      >
        <a :id="`year-${year}`" />
        <h3
          class="text-xl"
          v-text="year"
        />

        <section
          v-for="team in teams"
          :id="`${year}-${team.name}`"
          :key="`${year}-${team.name}`"
          class="pl-4"
        >
          <a :id="`year-${year}-team-${team.name}`" />
          <h4
            class="text-lg"
            v-text="
              `${team.name} (${team.finish}) (${mean(generateBestPossibleTeam(team.players).map((p) => p.rating)).toFixed(2)}) ${team.champions ? '(Champions)' : ''}`
            "
          />
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-1/8">
                  Name
                </th>
                <th class="w-1/3">
                  Positions
                </th>
                <th class="w-1/12">
                  Apps
                </th>
                <th class="w-1/12">
                  Tries
                </th>
                <th class="w-1/12">
                  Points
                </th>
                <th class="w-1/8">
                  Dream Team?
                </th>
                <th class="w-1/12">
                  MoS?
                </th>
                <th class="w-1/12">
                  Lance Todd?
                </th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="player in generateBestPossibleTeam(team.players)"
                :key="`${year}-${team}-${player?.url}`"
              >
                <TableRow
                  v-if="player"
                  :player="player"
                />
              </template>
            </tbody>
          </table>
        </section>
      </CardComponent>
    </CardComponent>
  </div>
</template>

<style scoped></style>
