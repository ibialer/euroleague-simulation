// Script to fetch head-to-head results from Euroleague API
// Usage: npx tsx scripts/fetch-h2h.ts

const BATTLE_TEAMS = [
  "Hapoel Tel Aviv",
  "Valencia",
  "Zalgiris",
  "Barcelona",
  "Panathinaikos",
  "Crvena Zvezda",
  "Monaco",
  "Maccabi Tel Aviv",
  "Dubai",
];

// Map API team names to our short names
const TEAM_NAME_MAP: Record<string, string> = {
  "Hapoel Shlomo Tel Aviv": "Hapoel Tel Aviv",
  "Hapoel IBI Tel Aviv": "Hapoel Tel Aviv",
  "Valencia Basket": "Valencia",
  "Zalgiris Kaunas": "Zalgiris",
  "Žalgiris Kaunas": "Zalgiris",
  "FC Barcelona": "Barcelona",
  "Panathinaikos AKTOR Athens": "Panathinaikos",
  "Panathinaikos AKTOR": "Panathinaikos",
  "Crvena zvezda Meridianbet Belgrade": "Crvena Zvezda",
  "Crvena zvezda Meridianbet": "Crvena Zvezda",
  "AS Monaco": "Monaco",
  "Maccabi Rapyd Tel Aviv": "Maccabi Tel Aviv",
  "Maccabi Playtika Tel Aviv": "Maccabi Tel Aviv",
  "Dubai Basketball": "Dubai",
};

function normalize(name: string): string {
  return TEAM_NAME_MAP[name] ?? name;
}

async function fetchRound(round: number): Promise<any[]> {
  // Try the Euroleague live API
  const url = `https://api-live.euroleague.net/v3/competitions/E/seasons/E2025/games?round=${round}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data.data ?? data ?? [];
    }
  } catch {}

  // Fallback: try older API format
  const url2 = `https://live.euroleague.net/api/Results?gamecode=&seasoncode=E2025&round=${round}`;
  try {
    const res = await fetch(url2);
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return [];
}

async function main() {
  const h2hResults: Array<{
    home: string;
    away: string;
    homeScore: number;
    awayScore: number;
    round: number;
  }> = [];

  console.log("Fetching Euroleague results for rounds 1-35...\n");

  for (let round = 1; round <= 35; round++) {
    const games = await fetchRound(round);
    if (games.length === 0) {
      console.log(`Round ${round}: no data`);
      continue;
    }

    for (const game of games) {
      // Handle different API response formats
      const homeTeam =
        game.homeTeam?.name ??
        game.hometeam ??
        game.HomeTeam ??
        game.localclub?.name ??
        "";
      const awayTeam =
        game.awayTeam?.name ??
        game.awayteam ??
        game.AwayTeam ??
        game.roadclub?.name ??
        "";
      const homeScore =
        game.homeTeam?.score ??
        game.homescore ??
        game.HomeScore ??
        game.localclub?.score ??
        0;
      const awayScore =
        game.awayTeam?.score ??
        game.awayscore ??
        game.AwayScore ??
        game.roadclub?.score ??
        0;

      const home = normalize(homeTeam);
      const away = normalize(awayTeam);

      if (BATTLE_TEAMS.includes(home) && BATTLE_TEAMS.includes(away)) {
        h2hResults.push({
          home,
          away,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
          round,
        });
      }
    }
    process.stdout.write(`Round ${round}: ${games.length} games\n`);
  }

  console.log("\n\n=== HEAD-TO-HEAD RESULTS (Battle Teams) ===\n");
  console.log("export const HEAD_TO_HEAD_RESULTS = [");
  for (const r of h2hResults) {
    console.log(
      `  { home: "${r.home}", away: "${r.away}", homeScore: ${r.homeScore}, awayScore: ${r.awayScore} },`
    );
  }
  console.log("];");
}

main();
