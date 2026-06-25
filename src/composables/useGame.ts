import type { Match, Playoffs, TableTeam } from '@/types.ts'
import { inject, ref, type Ref } from 'vue'
import { INITIAL_STAT_MODIFIERS, INJECTABLES, PLAYER_TEAM_NAME } from '@/constants.ts'

export default function useGame() {
  const statModifiers: Ref<typeof INITIAL_STAT_MODIFIERS>
    = inject(
      INJECTABLES.STAT_MODIFIERS,
      ref(INITIAL_STAT_MODIFIERS),
    )

  function simulateGame(
    team1: TableTeam,
    team2: TableTeam,
    allowDraw: boolean | undefined = true,
  ) {
    const winningOdds = parseFloat((team1.rating / team2.rating).toFixed(2))
    const random = parseFloat((Math.random() * 2).toFixed(2))
    const calc = winningOdds - random

    const drawLeeway = allowDraw
      ? 0.01
      : 0

    // tip the favour towards the player
    let bias = 0
    if (team2.name === PLAYER_TEAM_NAME) {
      bias = statModifiers.value.bias
    }
    else if (team1.name === PLAYER_TEAM_NAME) {
      bias = -statModifiers.value.bias
    }

    let result = 'draw'
    if (calc > bias + drawLeeway) {
      result = team1.name
    }
    else if (calc < bias - drawLeeway) {
      result = team2.name
    }
    return {
      home: team1.name,
      away: team2.name,
      result: result,
    }
  }

  function simulateSeason(teams: TableTeam[]): Match[] {
    return teams.map((team1: TableTeam) => teams
      .filter((team2: TableTeam) => JSON.stringify(team1) !== JSON.stringify(team2))
      .map((team2): Match => simulateGame(
        team1,
        team2,
      ))).flat()
  }

  function simulatePlayoff(team1: TableTeam, team2: TableTeam): [Match, TableTeam] {
    const match = simulateGame(
      team1,
      team2,
      false,
    )
    return [
      match,
      match.result === team1.name
        ? team1
        : team2,
    ]
  }
  function simulatePlayoffs(
    first: TableTeam,
    second: TableTeam,
    third: TableTeam,
    fourth: TableTeam,
    fifth: TableTeam,
    sixth: TableTeam,
  ): Playoffs {
    const [
      eliminator1,
      eliminator1Winner,
    ] = simulatePlayoff(
      third,
      sixth,
    )
    const [
      eliminator2,
      eliminator2Winner,
    ] = simulatePlayoff(
      fourth,
      fifth,
    )

    /**
         * `first` plays the lowest-ranked eliminator winner,
         * `second` plays the highest-ranked eliminator winner
         */
    let
      semiFinal1: Match,
      semiFinal2: Match,
      semiFinal1Winner: TableTeam,
      semiFinal2Winner: TableTeam
    if (eliminator1Winner === third && eliminator2Winner === fourth) {
      [
        semiFinal1,
        semiFinal1Winner,
      ] = simulatePlayoff(
        second,
        third,
      );
      [
        semiFinal2,
        semiFinal2Winner,
      ] = simulatePlayoff(
        first,
        fourth,
      )
    }
    else if (eliminator1Winner === third && eliminator2Winner === fifth) {
      [
        semiFinal1,
        semiFinal1Winner,
      ] = simulatePlayoff(
        second,
        third,
      );
      [
        semiFinal2,
        semiFinal2Winner,
      ] = simulatePlayoff(
        first,
        fifth,
      )
    }
    else if (eliminator1Winner === sixth && eliminator2Winner === fourth) {
      [
        semiFinal1,
        semiFinal1Winner,
      ] = simulatePlayoff(
        second,
        fourth,
      );
      [
        semiFinal2,
        semiFinal2Winner,
      ] = simulatePlayoff(
        first,
        sixth,
      )
    }
    else {
      [
        semiFinal1,
        semiFinal1Winner,
      ] = simulatePlayoff(
        second,
        fifth,
      );
      [
        semiFinal2,
        semiFinal2Winner,
      ] = simulatePlayoff(
        first,
        sixth,
      )
    }
    const [
      grandFinal,
      grandFinalWinner]: [Match, TableTeam,
    ] = simulatePlayoff(
      first,
      semiFinal1Winner,
    )
    return {
      eliminator1,
      eliminator1Winner,
      eliminator2,
      eliminator2Winner,
      semiFinal1,
      semiFinal1Winner,
      semiFinal2,
      semiFinal2Winner,
      grandFinalWinner,
      grandFinal,
    }
  }

  return {
    simulateSeason,
    simulatePlayoffs,
  }
}
