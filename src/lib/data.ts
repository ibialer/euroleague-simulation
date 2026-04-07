export interface Team {
  rank: number;
  team: string;
  code: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  pointsScored: number;
  pointsConceded: number;
}

export interface Game {
  home: string;
  away: string;
  date: string;
  result?: { home: number; away: number };
}

export interface Round {
  round: number;
  dates: string;
  status: "completed" | "in_progress" | "upcoming";
  games: Game[];
}

// Standings after Round 35 (completed April 3, 2026)
// Points scored/conceded are approximate season totals based on available data
export const CURRENT_STANDINGS: Team[] = [
  { rank: 1,  team: "Fenerbahce",        code: "FEN", wins: 23, losses: 13, gamesPlayed: 36, pointsScored: 3006, pointsConceded: 2853 },
  { rank: 2,  team: "Real Madrid",        code: "RMA", wins: 22, losses: 12, gamesPlayed: 34, pointsScored: 2856, pointsConceded: 2690 },
  { rank: 3,  team: "Olympiacos",         code: "OLY", wins: 22, losses: 12, gamesPlayed: 34, pointsScored: 2812, pointsConceded: 2654 },
  { rank: 4,  team: "Valencia",           code: "VAL", wins: 22, losses: 13, gamesPlayed: 35, pointsScored: 2814, pointsConceded: 2733 },
  { rank: 5,  team: "Hapoel Tel Aviv",    code: "HTA", wins: 22, losses: 13, gamesPlayed: 35, pointsScored: 2869, pointsConceded: 2760 },
  { rank: 6,  team: "Zalgiris",           code: "ZAL", wins: 21, losses: 15, gamesPlayed: 36, pointsScored: 2935, pointsConceded: 2887 },
  { rank: 7,  team: "Barcelona",          code: "BAR", wins: 20, losses: 16, gamesPlayed: 36, pointsScored: 2914, pointsConceded: 2893 },
  { rank: 8,  team: "Panathinaikos",      code: "PAN", wins: 21, losses: 15, gamesPlayed: 36, pointsScored: 2913, pointsConceded: 2869 },
  { rank: 9,  team: "Crvena Zvezda",      code: "CZV", wins: 20, losses: 16, gamesPlayed: 36, pointsScored: 2904, pointsConceded: 2876 },
  { rank: 10, team: "Monaco",             code: "MON", wins: 19, losses: 16, gamesPlayed: 35, pointsScored: 2840, pointsConceded: 2830 },
  { rank: 11, team: "Maccabi Tel Aviv",   code: "MTA", wins: 18, losses: 16, gamesPlayed: 34, pointsScored: 2793, pointsConceded: 2759 },
  { rank: 12, team: "Dubai",              code: "DUB", wins: 19, losses: 17, gamesPlayed: 36, pointsScored: 2877, pointsConceded: 2880 },
  { rank: 13, team: "Milan",              code: "MIL", wins: 17, losses: 18, gamesPlayed: 35, pointsScored: 2780, pointsConceded: 2820 },
  { rank: 14, team: "Partizan",           code: "PAR", wins: 15, losses: 20, gamesPlayed: 35, pointsScored: 2750, pointsConceded: 2850 },
  { rank: 15, team: "Bayern Munich",      code: "BAY", wins: 15, losses: 20, gamesPlayed: 35, pointsScored: 2770, pointsConceded: 2860 },
  { rank: 16, team: "Paris Basketball",   code: "PBS", wins: 14, losses: 22, gamesPlayed: 36, pointsScored: 2791, pointsConceded: 2924 },
  { rank: 17, team: "Virtus Bologna",     code: "VIR", wins: 13, losses: 22, gamesPlayed: 35, pointsScored: 2701, pointsConceded: 2844 },
  { rank: 18, team: "Baskonia",           code: "BAS", wins: 10, losses: 24, gamesPlayed: 34, pointsScored: 2580, pointsConceded: 2780 },
  { rank: 19, team: "Anadolu Efes",       code: "EFS", wins: 10, losses: 25, gamesPlayed: 35, pointsScored: 2689, pointsConceded: 2903 },
  { rank: 20, team: "ASVEL",              code: "ASV", wins:  8, losses: 26, gamesPlayed: 34, pointsScored: 2530, pointsConceded: 2810 },
];

export const TOTAL_ROUNDS = 38;
export const TOTAL_TEAMS = 20;

// Remaining games: Rounds 36-38 + delayed games
export const REMAINING_GAMES: Round[] = [
  {
    round: 0,
    dates: "Delayed games",
    status: "upcoming",
    games: [
      { home: "Maccabi Tel Aviv", away: "Hapoel Tel Aviv",  date: "2026-04-12" },
    ],
  },
  {
    round: 36,
    dates: "April 7-8, 2026",
    status: "upcoming",
    games: [
      { home: "Olympiacos",       away: "Real Madrid",      date: "2026-04-07" },
      { home: "Virtus Bologna",   away: "Bayern Munich",    date: "2026-04-07" },
      { home: "Valencia",         away: "Milan",            date: "2026-04-07" },
      { home: "Baskonia",         away: "Maccabi Tel Aviv", date: "2026-04-07" },
      { home: "Monaco",           away: "ASVEL",            date: "2026-04-08" },
      { home: "Anadolu Efes",     away: "Partizan",         date: "2026-04-08" },
    ],
  },
  {
    round: 37,
    dates: "April 9-10, 2026",
    status: "upcoming",
    games: [
      { home: "Hapoel Tel Aviv",  away: "Olympiacos",       date: "2026-04-09" },
      { home: "Fenerbahce",       away: "Real Madrid",      date: "2026-04-09" },
      { home: "Milan",            away: "Bayern Munich",    date: "2026-04-09" },
      { home: "Valencia",         away: "Panathinaikos",    date: "2026-04-09" },
      { home: "Paris Basketball", away: "Maccabi Tel Aviv", date: "2026-04-09" },
      { home: "Dubai",            away: "Anadolu Efes",     date: "2026-04-10" },
      { home: "Monaco",           away: "Barcelona",        date: "2026-04-10" },
      { home: "ASVEL",            away: "Crvena Zvezda",    date: "2026-04-10" },
      { home: "Virtus Bologna",   away: "Baskonia",         date: "2026-04-10" },
      { home: "Partizan",         away: "Zalgiris",         date: "2026-04-10" },
    ],
  },
  {
    round: 38,
    dates: "April 16-17, 2026",
    status: "upcoming",
    games: [
      { home: "ASVEL",            away: "Fenerbahce",       date: "2026-04-16" },
      { home: "Maccabi Tel Aviv", away: "Virtus Bologna",   date: "2026-04-16" },
      { home: "Olympiacos",       away: "Milan",            date: "2026-04-16" },
      { home: "Partizan",         away: "Baskonia",         date: "2026-04-16" },
      { home: "Real Madrid",      away: "Crvena Zvezda",    date: "2026-04-16" },
      { home: "Dubai",            away: "Valencia",         date: "2026-04-17" },
      { home: "Zalgiris",         away: "Paris Basketball", date: "2026-04-17" },
      { home: "Monaco",           away: "Hapoel Tel Aviv",  date: "2026-04-17" },
      { home: "Panathinaikos",    away: "Anadolu Efes",     date: "2026-04-17" },
      { home: "Barcelona",        away: "Bayern Munich",    date: "2026-04-17" },
    ],
  },
];

export const PLAY_IN_FORMAT = {
  name: "Play-In Showdown",
  qualifyingPositions: [7, 8, 9, 10] as const,
  directPlayoffPositions: [1, 2, 3, 4, 5, 6] as const,
  eliminatedPositions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const,
  games: [
    {
      gameNumber: 1,
      description: "7th vs 8th",
      winnerResult: "7th seed in Playoffs (faces 2nd seed)",
      loserResult: "Plays Game 3",
    },
    {
      gameNumber: 2,
      description: "9th vs 10th",
      winnerResult: "Plays Game 3",
      loserResult: "Eliminated",
    },
    {
      gameNumber: 3,
      description: "Loser of G1 vs Winner of G2",
      winnerResult: "8th seed in Playoffs (faces 1st seed)",
      loserResult: "Eliminated",
    },
  ],
};

// Team colors for UI
export const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  FEN: { primary: "#FFED00", secondary: "#00205B" },
  RMA: { primary: "#FFFFFF", secondary: "#00529F" },
  OLY: { primary: "#CC0000", secondary: "#FFFFFF" },
  HTA: { primary: "#FFD700", secondary: "#C41E3A" },
  VAL: { primary: "#FF6600", secondary: "#000000" },
  ZAL: { primary: "#006633", secondary: "#FFFFFF" },
  BAR: { primary: "#A50044", secondary: "#004D98" },
  PAN: { primary: "#006838", secondary: "#FFFFFF" },
  CZV: { primary: "#CC0000", secondary: "#FFFFFF" },
  MON: { primary: "#CC0000", secondary: "#FFFFFF" },
  DUB: { primary: "#C4A24C", secondary: "#1A1A2E" },
  MTA: { primary: "#FFD700", secondary: "#0038A8" },
  MIL: { primary: "#CC0000", secondary: "#FFFFFF" },
  PAR: { primary: "#000000", secondary: "#FFFFFF" },
  BAY: { primary: "#DC052D", secondary: "#0066B2" },
  PBS: { primary: "#003366", secondary: "#FFD700" },
  VIR: { primary: "#000000", secondary: "#FFFFFF" },
  BAS: { primary: "#003DA5", secondary: "#CE1126" },
  EFS: { primary: "#00205B", secondary: "#FFFFFF" },
  ASV: { primary: "#003366", secondary: "#FFD700" },
};
