"use client";

import { type ProjectedStandings } from "@/lib/simulation";

interface Props {
  standings: ProjectedStandings[];
}

export default function PlayInBracket({ standings }: Props) {
  const seed7 = standings.find((t) => t.finalRank === 7);
  const seed8 = standings.find((t) => t.finalRank === 8);
  const seed9 = standings.find((t) => t.finalRank === 9);
  const seed10 = standings.find((t) => t.finalRank === 10);

  if (!seed7 || !seed8 || !seed9 || !seed10) return null;

  const allPicked =
    standings.filter((t) => t.addedWins + t.addedLosses > 0).length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
        Play-In Showdown Matchups
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Game 1: 7th vs 8th */}
        <div className="bg-gray-800 rounded-lg p-4 ring-1 ring-yellow-700/30">
          <div className="text-xs text-yellow-500 font-semibold mb-2">
            GAME 1 — Winner to Playoffs (7th)
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{seed7.team}</span>
              <span className="text-xs text-gray-400">
                {seed7.totalWins}-{seed7.totalLosses}
              </span>
            </div>
            <div className="text-center text-gray-500 text-xs">vs</div>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{seed8.team}</span>
              <span className="text-xs text-gray-400">
                {seed8.totalWins}-{seed8.totalLosses}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Loser → Game 3
          </div>
        </div>

        {/* Game 2: 9th vs 10th */}
        <div className="bg-gray-800 rounded-lg p-4 ring-1 ring-yellow-700/30">
          <div className="text-xs text-yellow-500 font-semibold mb-2">
            GAME 2 — Loser Eliminated
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{seed9.team}</span>
              <span className="text-xs text-gray-400">
                {seed9.totalWins}-{seed9.totalLosses}
              </span>
            </div>
            <div className="text-center text-gray-500 text-xs">vs</div>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{seed10.team}</span>
              <span className="text-xs text-gray-400">
                {seed10.totalWins}-{seed10.totalLosses}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Winner → Game 3
          </div>
        </div>

        {/* Game 3: Loser G1 vs Winner G2 */}
        <div className="bg-gray-800 rounded-lg p-4 ring-1 ring-orange-700/30">
          <div className="text-xs text-orange-500 font-semibold mb-2">
            GAME 3 — Last Chance for Playoffs (8th)
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span>Loser of Game 1</span>
            </div>
            <div className="text-center text-gray-500 text-xs">vs</div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Winner of Game 2</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Loser eliminated
          </div>
        </div>
      </div>

      {/* Context: what positions 6 and 11 look like */}
      {allPicked && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-green-900/20 rounded-lg p-3 ring-1 ring-green-700/30">
            <div className="text-xs text-green-500 font-semibold mb-1">
              LAST DIRECT PLAYOFF SPOT (6th)
            </div>
            {standings
              .filter((t) => t.finalRank === 6)
              .map((t) => (
                <div key={t.code} className="text-white font-medium">
                  {t.team}{" "}
                  <span className="text-gray-400 text-sm">
                    ({t.totalWins}-{t.totalLosses})
                  </span>
                </div>
              ))}
          </div>
          <div className="bg-red-900/20 rounded-lg p-3 ring-1 ring-red-700/30">
            <div className="text-xs text-red-500 font-semibold mb-1">
              FIRST ELIMINATED (11th)
            </div>
            {standings
              .filter((t) => t.finalRank === 11)
              .map((t) => (
                <div key={t.code} className="text-white font-medium">
                  {t.team}{" "}
                  <span className="text-gray-400 text-sm">
                    ({t.totalWins}-{t.totalLosses})
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
