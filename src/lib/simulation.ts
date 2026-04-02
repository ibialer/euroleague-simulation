import { CURRENT_STANDINGS, REMAINING_GAMES, type Team } from "./data";

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
    pick.homeScore !== pick.awayScore // No ties in basketball
  );
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

  // Sort: total wins desc, then point differential desc, then current rank
  standings.sort((a, b) => {
    if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
    return a.rank - b.rank;
  });

  standings.forEach((team, i) => {
    team.finalRank = i + 1;
    team.rankChange = team.rank - team.finalRank;
  });

  return standings;
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
    // Generate realistic scores (70-100 range)
    const winnerScore = Math.floor(Math.random() * 20) + 78;
    const loserScore = Math.floor(Math.random() * 15) + 65;

    return {
      ...pick,
      homeScore: homeWin ? winnerScore : loserScore,
      awayScore: homeWin ? loserScore : winnerScore,
    };
  });
}

// Teams in the play-in battle zone
export const PLAY_IN_BATTLE_TEAMS = new Set([
  "Zalgiris",
  "Barcelona",
  "Panathinaikos",
  "Crvena Zvezda",
  "Monaco",
  "Dubai",
  "Maccabi Tel Aviv",
  "Milan",
]);

export function isPlayInBattleGame(game: GamePick): boolean {
  return PLAY_IN_BATTLE_TEAMS.has(game.home) || PLAY_IN_BATTLE_TEAMS.has(game.away);
}
