import { JSDOM } from 'jsdom'

const RLP_URL = "https://rugbyleagueproject.org/seasons";
const FIRST_SEASON = 2025;

type Season = number;
type TeamName = string;
type PlayerName = string;
type PlayerURL = string
type Position = string;
type Player = {
  url: string,
  name: PlayerName,
  positions: Position[],
  stats: Record<string, number>
}


const seasons: Record<Season, Record<TeamName, Record<PlayerURL, Player>>> = {};

async function getPageData(season: number, team: string) {
  console.log(season, team);
  const players: Record<PlayerName, Player> = {}
  const detailPage = await fetch(`${RLP_URL}/super-league-${season}/${team}/detail.html`);
  if (detailPage.status !== 200) {
    console.error(detailPage.status);
    return;
  }

  const text = await detailPage.text()
  if (!text) {
    return
  }
  const detailPageDocument = new JSDOM(text).window.document;

  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  const table = detailPageDocument.querySelector('table.grid.lines')
  if (!table) {
    return
  }
  table.querySelectorAll('tr').forEach(function (row) {
    const nameCell = row.querySelector('td > a:first-of-type');
    if (!row || !nameCell) {
      return;
    }
    const name = nameCell.textContent;
    const url = nameCell.getAttribute('href');
    if (!(name && url)) {
      return
    }
    row.querySelectorAll('td:not(:first-of-type)').forEach(function (cell) {
      const text = cell.textContent
      if (text && text.trim() !== "" && text !== "B") {
        if (players[url] === undefined) {
          players[url] = {name, url, positions: [], stats: {}}
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
      players[key].positions = [...new Set(players[key].positions)]
    }
  });

  const summaryPage = await fetch(`${RLP_URL}/super-league-${season}/${team}/summary.html`);
  if (summaryPage.status !== 200) {
    return;
  }
  const summaryPageContent = await summaryPage.text();
  const summaryPageDocument = new JSDOM(summaryPageContent).window.document;
  const playerListTable = summaryPageDocument.querySelector('a[name="playerlist"] ~ table');
  if (!playerListTable) {
    console.error('No player list table')
    return;
  }
  playerListTable.querySelectorAll('tbody > tr').forEach(function (playerListRow: Element) {
    const playerNameCell = playerListRow.querySelector('td > a');
    if (! (playerNameCell && playerNameCell.textContent)) {
      console.error(`Could not find player name cell`)
      return;
    }
    const playerUrl = playerNameCell.getAttribute('href');
    if (!playerUrl || !players[playerUrl]) {
      console.error('No player URL');
      return;
    }
    const stats = [
      'app',
      'interchanges',
      'total',
      'tries',
      'goals',
      'field goals',
      'points',
      'binnings',
      'sendings',
    ]
    const foo = [...playerListRow.querySelectorAll('td')].slice(-10);
    foo.forEach(function (cell, index) {
      if (players[playerUrl] === undefined) {
        console.error(`No player called ${playerUrl}`)
        return;
      }
      if (stats[index] === undefined) {
        console.error(`No stat for index ${index}`)
        return;
      }
      const stat = parseInt(cell.textContent);
      players[playerUrl].stats[stats[index]] = stat ? stat : 0;
    })
  });

  seasons[season] ??= {};
  seasons[season][team] = players;
}

const years: number[] = [...Array(2026 - FIRST_SEASON).keys()].map((n) => FIRST_SEASON + n);

console.log(years);

const teams: string[] = [
  'hull-kingston-rovers',
  'castleford-tigers'
];
// getPageData(`super-league-${year}/${team}/detail.html`, year, team)
// construct this horrible mess of teams and years

  for (const t of teams) {
    for (const n of years) {
      await getPageData( n, t)
      await new Promise((r) => setTimeout(r, 1000))
    }
}

console.table(JSON.stringify(seasons, null, 2));
