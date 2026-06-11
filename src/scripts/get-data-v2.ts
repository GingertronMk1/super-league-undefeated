import { JSDOM } from 'jsdom'
import {
  type BasePlayer,
  type PlayerName,
  type Position,
  POSITION_ENUM,
  type Seasons,
  type Statistics,
} from '../types.ts'
import fs from 'fs'

const FIRST_SEASON = 1998
const SEASON_LIST = [...Array((new Date()).getFullYear() - FIRST_SEASON).keys()].map((n) => FIRST_SEASON + n)
const RLP_URL = 'https://rugbyleagueproject.org'

const BASE_STATISTIC: Statistics = {
  starts: 0,
  interchanges: 0,
  appearances: 0,
  tries: 0,
  goals: 0,
  field_goals: 0,
  points: 0,
  sin_bins: 0,
  send_offs: 0,
}

const statKeys = Object.keys(BASE_STATISTIC);

const seasons: Seasons = {}

const wait = async () =>
  await new Promise((r) => setTimeout(r, 1000))

function getNextWithText(document: Document, queryString: string, text: string) {
  const matches = [...document.querySelectorAll(queryString)];
  const match = matches.find((m) => m.textContent === text);
  return match ? match.nextElementSibling : null;
}


async function getPageData(season: number, teamName: string, seasonSummaryUrl: string, finish: number, champions: boolean) {
  const players: Record<PlayerName, BasePlayer> = {}
  const seasonBaseUrl = `${RLP_URL}${seasonSummaryUrl.replace('/summary.html', '')}`;
  console.log(`Getting ${season} data for ${teamName} from ${seasonBaseUrl}`)

  /**
   * Get detail page for appearances at positions
   */
  const detailPage = await fetch(`${seasonBaseUrl}/detail.html`)
  if (detailPage.status !== 200) {
    console.error(detailPage.status);
    return
  }

  const text = await detailPage.text()
  if (!text) {
    console.error('No text on detail page');
    return
  }
  const detailPageDocument = new JSDOM(text).window.document

  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  const table = detailPageDocument.querySelector('table.grid.lines')
  if (!table) {
    return
  }
  table.querySelectorAll('tr').forEach(function (row) {
    const nameCell = row.querySelector('td > a:first-of-type')
    if (!row || !nameCell) {
      return
    }
    const name = nameCell.textContent
    const url = nameCell.getAttribute('href')
    if (!(name && url)) {
      return
    }
    row.querySelectorAll('td:not(:first-of-type)').forEach(function (cell) {
      const text = cell.textContent
      if (text && text.trim() !== '' && text !== 'B') {
        if (players[url] === undefined) {
          players[url] = { name, url, positions: [], stats: BASE_STATISTIC }
        }
        if (Object.keys(POSITION_ENUM).includes(text)) {
          players[url].positions.push(text as Position)
        }
      }
    })
  })

  Object.keys(players).forEach(function (key: string) {
    if (players[key]) {
      if (players[key].positions.length === 0) {
        delete players[key]
      }
      const playerPositions: Position[] = players[key].positions
      const timesAtPosition = (needle: string) => playerPositions.filter((haystack) => needle === haystack).length
      const playerPositionsDeduped: Position[] = [...new Set(playerPositions)];
      playerPositionsDeduped.sort((a: Position, b: Position) => timesAtPosition(b) - timesAtPosition(a));
      players[key].positions = playerPositionsDeduped;
    }
  })

  /**
   * Get summary page for individual statistics
   */
  const summaryPage = await fetch(`${seasonBaseUrl}/summary.html`)
  if (summaryPage.status !== 200) {
    return
  }
  const summaryPageContent = await summaryPage.text()
  const summaryPageDocument = new JSDOM(summaryPageContent).window.document


  const playerListTable = summaryPageDocument.querySelector('a[name="playerlist"] ~ table')
  if (!playerListTable) {
    console.error('No player list table')
    return
  }
  playerListTable.querySelectorAll('tbody > tr').forEach(function (playerListRow: Element) {
    const playerNameCell = playerListRow.querySelector('td > a')
    if (!(playerNameCell && playerNameCell.textContent)) {
      // console.error(`Could not find player name cell`)
      return
    }
    const playerUrl = playerNameCell.getAttribute('href')
    if (!playerUrl || !players[playerUrl]) {
      // console.error('No player URL');
      return
    }
    // console.group(players[playerUrl].name, playerUrl);
    const foo = [...playerListRow.querySelectorAll('td')].slice(-10, -1)
    const stats: Statistics = BASE_STATISTIC;
    foo.forEach(function (cell, index) {
      if (players[playerUrl] === undefined) {
        console.error(`No player called ${playerUrl}`)
        return
      }
      if (index > statKeys.length) {
        return
      }
      const statKey = statKeys[index]
      if (statKey === undefined) {
        console.error(`No stat for index ${index}`)
        return
      }
      const stat = parseInt(cell.textContent)
      stats[statKey as keyof Statistics] = !isNaN(stat) ? stat : 0
    })
    players[playerUrl].stats = {...stats};
    // console.table(players[playerUrl].stats)
    // console.groupEnd();
  })

  const playersArr = Object.values(players);
  playersArr.sort((a, b) => {
    const appDifference = b.stats.appearances - a.stats.appearances
    if (appDifference !== 0) {
      return appDifference;
    }
    return b.name.localeCompare(a.name);
  });


  seasons[season] ??= []
  seasons[season].push({
    name: teamName,
    champions: champions,
    finish,
    players: playersArr
  });
}

console.time('total');

for (const season of SEASON_LIST) {
  console.group(`Getting season ${season}...`)
  const doc = await fetch(
    `https://www.rugbyleagueproject.org/seasons/super-league-${season}/summary.html`,
  )
  if (doc.status !== 200) {
    console.error('Doc returned non-200 code', doc.status)
    continue;
  }
  const docDom = new JSDOM(await doc.text()).window.document

  let teamsTable = getNextWithText(docDom, 'h2', 'Ladder');
  if (!teamsTable) {
    teamsTable = getNextWithText(docDom, 'h3', 'League Ladder')
    if (!teamsTable) {
      console.error('No teams table')
      continue
    }
  }
  console.log('Found teams for season, getting more details');
  const teamChampions =
    getNextWithText(docDom, 'dt', 'Champions')?.querySelector('a')?.href ?? 'unknown';
  const ladder =teamsTable.querySelectorAll('table > tbody tr.data');
  for (const team of ladder) {
    const teamLink = team.querySelector('td > a');
    const teamRank = team.querySelector('td.rank');
    const teamFinish = parseInt(teamRank?.textContent.replace('.', '') ?? '0');
    if (!teamLink) {
      continue;
    }
    console.group(`${teamLink.textContent} (${season})`)
    const href = teamLink.getAttribute('href');
    if (href !== null) {
      const isTeamChampion = teamChampions.trim() === href;
      await getPageData(season, teamLink.textContent, href, teamFinish, isTeamChampion);
      console.timeLog('total');
      await wait();
    }
    console.groupEnd();
  }
  fs.writeFileSync('./public/data.json', JSON.stringify(seasons, null, 2))
  console.groupEnd();
  await wait()
}
console.timeEnd('total');

fs.writeFileSync('./public/data.json', JSON.stringify(seasons, null, 2))
