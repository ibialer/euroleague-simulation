import { CURRENT_STANDINGS, REMAINING_GAMES, type Team } from "./data";
import { HEAD_TO_HEAD_RESULTS, type H2HGame } from "./h2h";

export interface GamePick {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface ProjectedStandings extends Team {
  addedWins: number;
  addedLosses: number;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  pointsScored: number;
  pointsConceded: number;
  pointDiff: number;
  finalRank: number;
  rankChange: number;
}

// Teams locked in positions 1-3 (cannot drop)
const LOCKED_TOP = new Set(["Fenerbahce", "Real Madrid", "Olympiacos"]);

// Teams locked at 13+ (cannot rise into play-in zone)
const LOCKED_BOTTOM = new Set([
  "Milan", "Partizan", "Bayern Munich", "Paris Basketball",
  "Virtus Bologna", "Baskonia", "Anadolu Efes", "ASVEL",
]);

// Build the list of all remaining games with empty score slots
export function buildGamePicks(): GamePick[] {
  const picks: GamePick[] = [];
  for (const round of REMAINING_GAMES) {
    for (const game of round.games) {
      if (game.result) continue;
      picks.push({
        home: game.home,
        away: game.away,
        homeScore: null,
        awayScore: null,
      });
    }
  }
  return picks;
}

function isGameComplete(pick: GamePick): boolean {
  return (
    pick.homeScore !== null &&
    pick.awayScore !== null &&
    pick.homeScore !== pick.awayScore
  );
}

// Collect all h2h games (historical + user-entered) between a group of tied teams
function getH2HGames(
  teamNames: string[],
  userPicks: GamePick[]
): H2HGame[] {
  const teamSet = new Set(teamNames);
  const games: H2HGame[] = [];

  // Historical h2h results
  for (const game of HEAD_TO_HEAD_RESULTS) {
    if (teamSet.has(game.home) && teamSet.has(game.away)) {
      games.push(game);
    }
  }

  // User-entered results between these teams
  for (const pick of userPicks) {
    if (!isGameComplete(pick)) continue;
    if (teamSet.has(pick.home) && teamSet.has(pick.away)) {
      games.push({
        home: pick.home,
        away: pick.away,
        homeScore: pick.homeScore!,
        awayScore: pick.awayScore!,
      });
    }
  }

  return games;
}

// Calculate h2h record for a team within a group of tied teams
function getH2HRecord(
  teamName: string,
  games: H2HGame[]
): { wins: number; losses: number; pointDiff: number } {
  let wins = 0;
  let losses = 0;
  let pointDiff = 0;

  for (const game of games) {
    if (game.home === teamName) {
      pointDiff += game.homeScore - game.awayScore;
      if (game.homeScore > game.awayScore) wins++;
      else losses++;
    } else if (game.away === teamName) {
      pointDiff += game.awayScore - game.homeScore;
      if (game.awayScore > game.homeScore) wins++;
      else losses++;
    }
  }

  return { wins, losses, pointDiff };
}

// Euroleague tiebreaker: sort a group of teams with the same wins
// 1. H2H record among tied teams
// 2. H2H point differential among tied teams
// 3. Overall point differential
// 4. Original rank as last resort
function sortTiedGroup(
  teams: ProjectedStandings[],
  userPicks: GamePick[]
): ProjectedStandings[] {
  if (teams.length <= 1) return teams;

  const teamNames = teams.map((t) => t.team);
  const h2hGames = getH2HGames(teamNames, userPicks);

  // Calculate h2h records
  const h2hRecords = new Map<
    string,
    { wins: number; losses: number; pointDiff: number }
  >();
  for (const team of teams) {
    h2hRecords.set(team.team, getH2HRecord(team.team, h2hGames));
  }

  return [...teams].sort((a, b) => {
    const aH2H = h2hRecords.get(a.team)!;
    const bH2H = h2hRecords.get(b.team)!;

    // 1. H2H wins
    if (bH2H.wins !== aH2H.wins) return bH2H.wins - aH2H.wins;
    // 2. H2H point differential
    if (bH2H.pointDiff !== aH2H.pointDiff) return bH2H.pointDiff - aH2H.pointDiff;
    // 3. Overall point differential
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
    // 4. Original rank
    return a.rank - b.rank;
  });
}

// Calculate projected standings based on current picks
export function calculateStandings(picks: GamePick[]): ProjectedStandings[] {
  const addedWins = new Map<string, number>();
  const addedLosses = new Map<string, number>();
  const pointsFor = new Map<string, number>();
  const pointsAgainst = new Map<string, number>();

  for (const team of CURRENT_STANDINGS) {
    addedWins.set(team.team, 0);
    addedLosses.set(team.team, 0);
    pointsFor.set(team.team, 0);
    pointsAgainst.set(team.team, 0);
  }

  for (const pick of picks) {
    if (!isGameComplete(pick)) continue;
    const homeScore = pick.homeScore!;
    const awayScore = pick.awayScore!;
    const homeWon = homeScore > awayScore;

    const winner = homeWon ? pick.home : pick.away;
    const loser = homeWon ? pick.away : pick.home;

    addedWins.set(winner, (addedWins.get(winner) ?? 0) + 1);
    addedLosses.set(loser, (addedLosses.get(loser) ?? 0) + 1);

    pointsFor.set(pick.home, (pointsFor.get(pick.home) ?? 0) + homeScore);
    pointsAgainst.set(pick.home, (pointsAgainst.get(pick.home) ?? 0) + awayScore);
    pointsFor.set(pick.away, (pointsFor.get(pick.away) ?? 0) + awayScore);
    pointsAgainst.set(pick.away, (pointsAgainst.get(pick.away) ?? 0) + homeScore);
  }

  const standings: ProjectedStandings[] = CURRENT_STANDINGS.map((team) => {
    const aw = addedWins.get(team.team) ?? 0;
    const al = addedLosses.get(team.team) ?? 0;
    const pf = (pointsFor.get(team.team) ?? 0) + team.pointsScored;
    const pa = (pointsAgainst.get(team.team) ?? 0) + team.pointsConceded;
    return {
      ...team,
      addedWins: aw,
      addedLosses: al,
      totalWins: team.wins + aw,
      totalLosses: team.losses + al,
      totalGames: team.gamesPlayed + aw + al,
      pointsScored: pf,
      pointsConceded: pa,
      pointDiff: pf - pa,
      finalRank: 0,
      rankChange: 0,
    };
  });

  // Step 1: Separate locked top (1-3), battle zone (4-12), and locked bottom (13+)
  const lockedTop = standings.filter((t) => LOCKED_TOP.has(t.team));
  const battleTeams = standings.filter(
    (t) => !LOCKED_TOP.has(t.team) && !LOCKED_BOTTOM.has(t.team)
  );
  const lockedBottom = standings.filter((t) => LOCKED_BOTTOM.has(t.team));

  // Sort locked top among themselves
  lockedTop.sort((a, b) => {
    if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
    return a.rank - b.rank;
  });

  // Sort locked bottom among themselves
  lockedBottom.sort((a, b) => {
    if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
    return a.rank - b.rank;
  });

  // Step 2: Sort battle teams by wins desc, then fewer losses
  battleTeams.sort((a, b) => {
    if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
    if (a.totalLosses !== b.totalLosses) return a.totalLosses - b.totalLosses;
    return a.rank - b.rank;
  });

  // Step 3: Apply h2h tiebreakers within groups of same W-L record
  const sortedBattle: ProjectedStandings[] = [];
  let i = 0;
  while (i < battleTeams.length) {
    let j = i;
    while (
      j < battleTeams.length &&
      battleTeams[j].totalWins === battleTeams[i].totalWins &&
      battleTeams[j].totalLosses === battleTeams[i].totalLosses
    ) {
      j++;
    }
    const group = battleTeams.slice(i, j);
    const sorted = sortTiedGroup(group, picks);
    sortedBattle.push(...sorted);
    i = j;
  }

  // Step 4: Combine: top 3 + battle zone + bottom
  const finalStandings = [...lockedTop, ...sortedBattle, ...lockedBottom];
  finalStandings.forEach((team, idx) => {
    team.finalRank = idx + 1;
    team.rankChange = team.rank - team.finalRank;
  });

  return finalStandings;
}

// Generate a random realistic score with a given winner
export function generateRandomScore(winner: "home" | "away"): {
  homeScore: number;
  awayScore: number;
} {
  const winnerScore = Math.floor(Math.random() * 20) + 78; // 78-97
  const loserScore = Math.floor(Math.random() * Math.min(15, winnerScore - 65)) + 65; // 65-79, always less than winner
  return {
    homeScore: winner === "home" ? winnerScore : loserScore,
    awayScore: winner === "home" ? loserScore : winnerScore,
  };
}

// Auto-fill remaining picks with random scores
export function autoFillPicks(picks: GamePick[]): GamePick[] {
  return picks.map((pick) => {
    if (isGameComplete(pick)) return pick;

    const homeTeam = CURRENT_STANDINGS.find((t) => t.team === pick.home)!;
    const awayTeam = CURRENT_STANDINGS.find((t) => t.team === pick.away)!;

    const homeWinPct = homeTeam.wins / homeTeam.gamesPlayed;
    const awayWinPct = awayTeam.wins / awayTeam.gamesPlayed;
    const homeAdv = 0.06;
    const diff = homeWinPct - awayWinPct + homeAdv;
    const prob = Math.min(0.85, Math.max(0.15, 0.5 + diff * 0.8));

    const homeWin = Math.random() < prob;
    const winnerScore = Math.floor(Math.random() * 20) + 78;
    const loserScore = Math.floor(Math.random() * 15) + 65;

    return {
      ...pick,
      homeScore: homeWin ? winnerScore : loserScore,
      awayScore: homeWin ? loserScore : winnerScore,
    };
  });
}

// Teams in the play-in battle zone (positions 4-12)
export const PLAY_IN_BATTLE_TEAMS = new Set([
  "Hapoel Tel Aviv",
  "Valencia",
  "Zalgiris",
  "Barcelona",
  "Panathinaikos",
  "Crvena Zvezda",
  "Monaco",
  "Maccabi Tel Aviv",
  "Dubai",
]);

export function isPlayInBattleGame(game: GamePick): boolean {
  return PLAY_IN_BATTLE_TEAMS.has(game.home) || PLAY_IN_BATTLE_TEAMS.has(game.away);
}
