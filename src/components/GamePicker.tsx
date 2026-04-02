"use client";

import { type GamePick, isPlayInBattleGame } from "@/lib/simulation";
import { REMAINING_GAMES } from "@/lib/data";

interface Props {
  picks: GamePick[];
  onScoreChange: (index: number, side: "home" | "away", score: number | null) => void;
  focusMode: boolean;
}

export default function GamePicker({ picks, onScoreChange, focusMode }: Props) {
  // Group picks by round
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
                Round {round.round}
                <span className="text-gray-500 font-normal ml-2">
                  {round.dates}
                </span>
              </h3>
              <span className="text-xs text-gray-500">
                {completedCount}/{round.picks.length} done
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
                    className={`flex items-center gap-2 rounded-lg p-2.5 ${
                      isBattle
                        ? "bg-gray-800 ring-1 ring-yellow-700/50"
                        : "bg-gray-800/50"
                    } ${isTied ? "ring-1 ring-red-500/50" : ""}`}
                  >
                    {/* Home team */}
                    <div
                      className={`flex-1 text-sm text-right ${
                        homeWon
                          ? "text-green-400 font-semibold"
                          : awayWon
                          ? "text-gray-500"
                          : "text-gray-200"
                      }`}
                    >
                      <span className="text-[10px] text-gray-500 mr-1">H</span>
                      {pick.home}
                    </div>

                    {/* Score inputs */}
                    <div className="flex items-center gap-1">
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
                        className={`w-12 h-8 text-center text-sm rounded bg-gray-700 border ${
                          homeWon
                            ? "border-green-600 text-green-400"
                            : isTied
                            ? "border-red-500 text-red-400"
                            : "border-gray-600 text-white"
                        } focus:outline-none focus:ring-1 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="—"
                      />
                      <span className="text-gray-600 text-xs font-mono">:</span>
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
                        className={`w-12 h-8 text-center text-sm rounded bg-gray-700 border ${
                          awayWon
                            ? "border-green-600 text-green-400"
                            : isTied
                            ? "border-red-500 text-red-400"
                            : "border-gray-600 text-white"
                        } focus:outline-none focus:ring-1 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="—"
                      />
                    </div>

                    {/* Away team */}
                    <div
                      className={`flex-1 text-sm ${
                        awayWon
                          ? "text-green-400 font-semibold"
                          : homeWon
                          ? "text-gray-500"
                          : "text-gray-200"
                      }`}
                    >
                      {pick.away}
                      <span className="text-[10px] text-gray-500 ml-1">A</span>
                    </div>
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
