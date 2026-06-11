import { JSDOM } from 'jsdom'
import type { Player, PlayerName, Seasons, Statistics } from '@/types.ts'
import fs from 'fs'

const FIRST_SEASON = 1998
const SEASON_LIST = [...Array(2026 - FIRST_SEASON).keys()].map((n) => FIRST_SEASON + n)
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


const seasons: Seasons = {}

const wait = async () =>
  await new Promise((r) => setTimeout(r, 1000))

function getNextWithText(document: Document, queryString: string, text: string) {
  const matches = [...document.querySelectorAll(queryString)];
  const match = matches.find((m) => m.textContent === text);
  return match ? match.nextElementSibling : null;
}


async function getPageData(season: number, teamName: string, seasonSummaryUrl: string) {
  const players: Record<PlayerName, Player> = {}
  const seasonBaseUrl = `${RLP_URL}${seasonSummaryUrl.replace('/summary.html', '')}`;
  console.log(`Getting ${season} data for ${teamName} from ${seasonBaseUrl}`)
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
        players[url].positions.push(text)
      }
    })
  })

  Object.keys(players).forEach(function (key: string) {
    if (players[key]) {
      if (players[key].positions.length === 0) {
        delete players[key]
      }
      const playerPositions = players[key].positions
      const timesAtPosition = (needle: string) => playerPositions.filter((haystack) => needle === haystack).length
      const playerPositionsDeduped = [...new Set(playerPositions)];
      playerPositionsDeduped.sort((a, b) => timesAtPosition(b) - timesAtPosition(a));
      players[key].positions = playerPositionsDeduped;
    }
  })

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
    const stats: string[] = Object.keys(BASE_STATISTIC)
    const foo = [...playerListRow.querySelectorAll('td')].slice(-10)
    foo.forEach(function (cell, index) {
      if (players[playerUrl] === undefined) {
        console.error(`No player called ${playerUrl}`)
        return
      }
      if (index > stats.length) {
        return
      }
      if (stats[index] === undefined) {
        // console.error(`No stat for index ${index}`)
        return
      }
      const stat = parseInt(cell.textContent)
      players[playerUrl].stats[stats[index] as keyof Statistics] = stat ? stat : 0
    })
  })

  seasons[season] ??= {}
  seasons[season][teamName] = players
}


for (const season of SEASON_LIST) {
  console.log(`Getting season ${season}...`)
  const doc = await fetch(
    `https://www.rugbyleagueproject.org/seasons/super-league-${season}/summary.html`,
  )
  if (doc.status !== 200) {
    console.error('Doc returned non-200 code', doc.status)
    continue;
  }
  const docDom = new JSDOM(await doc.text()).window.document

  const teamsTable = getNextWithText(docDom, 'h2', 'Ladder');
  if (!teamsTable) {
    console.error('No teams table')
    continue;
  }
  console.log('Found teams for season, getting more details');
  const teams = teamsTable.querySelectorAll('table > tbody tr.data td > a');
  for (const teamLink of teams) {
    console.group(`${teamLink.textContent} (${season})`)
    console.log(`- Getting data for ${teamLink.textContent}...`)
    const href = teamLink.getAttribute('href');
    if (href !== null) {
      await getPageData(season, teamLink.textContent, href);
      await wait();
    }
    console.groupEnd();
  }
  fs.writeFileSync('./public/data.json', JSON.stringify(seasons, null, 2))
  await wait()
}

fs.writeFileSync('./public/data.json', JSON.stringify(seasons, null, 2))
