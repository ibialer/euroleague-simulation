"use client";

import { type GamePick, isPlayInBattleGame } from "@/lib/simulation";
import { REMAINING_GAMES } from "@/lib/data";

interface Props {
  picks: GamePick[];
  onScoreChange: (index: number, side: "home" | "away", score: number | null) => void;
  onQuickPick: (index: number, winner: "home" | "away") => void;
  focusMode: boolean;
}

export default function GamePicker({ picks, onScoreChange, onQuickPick, focusMode }: Props) {
  let gameIndex = 0;
  const rounds = REMAINING_GAMES.map((round) => {
    const roundPicks: { pick: GamePick; globalIndex: number }[] = [];
    for (const game of round.games) {
      if (game.result) continue;
      roundPicks.push({ pick: picks[gameIndex], globalIndex: gameIndex });
      gameIndex++;
    }
    return { ...round, picks: roundPicks };
  });

  return (
    <div className="space-y-6">
      {rounds.map((round) => {
        const gamesToShow = focusMode
          ? round.picks.filter((p) => isPlayInBattleGame(p.pick))
          : round.picks;

        if (gamesToShow.length === 0) return null;

        const completedCount = round.picks.filter(
          (p) =>
            p.pick.homeScore !== null &&
            p.pick.awayScore !== null &&
            p.pick.homeScore !== p.pick.awayScore
        ).length;

        return (
          <div key={round.round}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                {round.round === 0 ? "Delayed Games" : `Round ${round.round}`}
                <span className="text-gray-500 font-normal ml-2 text-xs">
                  {round.dates}
                </span>
              </h3>
              <span className="text-xs text-gray-500">
                {completedCount}/{round.picks.length}
              </span>
            </div>
            <div className="grid gap-2">
              {gamesToShow.map(({ pick, globalIndex }) => {
                const isBattle = isPlayInBattleGame(pick);
                const isComplete =
                  pick.homeScore !== null &&
                  pick.awayScore !== null &&
                  pick.homeScore !== pick.awayScore;
                const homeWon = isComplete && pick.homeScore! > pick.awayScore!;
                const awayWon = isComplete && pick.awayScore! > pick.homeScore!;
                const isTied =
                  pick.homeScore !== null &&
                  pick.awayScore !== null &&
                  pick.homeScore === pick.awayScore;

                return (
                  <div
                    key={globalIndex}
                    className={`flex items-center gap-1 sm:gap-1.5 rounded-lg p-2 sm:p-2.5 ${
                      isBattle
                        ? "bg-gray-800 ring-1 ring-yellow-700/50"
                        : "bg-gray-800/50"
                    } ${isTied ? "ring-1 ring-red-500/50" : ""}`}
                  >
                    {/* Home quick-pick */}
                    <button
                      onClick={() => onQuickPick(globalIndex, "home")}
                      title={`${pick.home} wins`}
                      className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                        homeWon
                          ? "bg-green-700 text-green-200"
                          : "bg-gray-700 text-gray-400 hover:bg-green-800 hover:text-green-300"
                      }`}
                    >
                      W
                    </button>

                    {/* Home team name */}
                    <div
                      className={`flex-1 text-xs sm:text-sm text-right truncate ${
                        homeWon
                          ? "text-green-400 font-semibold"
                          : awayWon
                          ? "text-gray-500"
                          : "text-gray-200"
                      }`}
                    >
                      {pick.home}
                    </div>

                    {/* Score inputs */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={200}
                        value={pick.homeScore ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onScoreChange(
                            globalIndex,
                            "home",
                            val === "" ? null : parseInt(val, 10)
                          );
                        }}
                        className={`w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm rounded bg-gray-700 border ${
                          homeWon
                            ? "border-green-600 text-green-400"
                            : isTied
                            ? "border-red-500 text-red-400"
                            : "border-gray-600 text-white"
                        } focus:outline-none focus:ring-1 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="—"
                      />
                      <span className="text-gray-600 text-xs">:</span>
                      <input
                        type="number"
                        min={0}
                        max={200}
                        value={pick.awayScore ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onScoreChange(
                            globalIndex,
                            "away",
                            val === "" ? null : parseInt(val, 10)
                          );
                        }}
                        className={`w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm rounded bg-gray-700 border ${
                          awayWon
                            ? "border-green-600 text-green-400"
                            : isTied
                            ? "border-red-500 text-red-400"
                            : "border-gray-600 text-white"
                        } focus:outline-none focus:ring-1 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="—"
                      />
                    </div>

                    {/* Away team name */}
                    <div
                      className={`flex-1 text-xs sm:text-sm truncate ${
                        awayWon
                          ? "text-green-400 font-semibold"
                          : homeWon
                          ? "text-gray-500"
                          : "text-gray-200"
                      }`}
                    >
                      {pick.away}
                    </div>

                    {/* Away quick-pick */}
                    <button
                      onClick={() => onQuickPick(globalIndex, "away")}
                      title={`${pick.away} wins`}
                      className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                        awayWon
                          ? "bg-green-700 text-green-200"
                          : "bg-gray-700 text-gray-400 hover:bg-green-800 hover:text-green-300"
                      }`}
                    >
                      W
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
