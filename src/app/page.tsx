"use client";

import { useState, useMemo, useCallback } from "react";
import {
  buildGamePicks,
  calculateStandings,
  autoFillPicks,
  type GamePick,
} from "@/lib/simulation";
import StandingsTable from "@/components/StandingsTable";
import GamePicker from "@/components/GamePicker";
import PlayInBracket from "@/components/PlayInBracket";

export default function Home() {
  const [picks, setPicks] = useState<GamePick[]>(() => buildGamePicks());
  const [focusMode, setFocusMode] = useState(true);

  const standings = useMemo(() => calculateStandings(picks), [picks]);

  const handleScoreChange = useCallback(
    (index: number, side: "home" | "away", score: number | null) => {
      setPicks((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          [side === "home" ? "homeScore" : "awayScore"]: score,
        };
        return next;
      });
    },
    []
  );

  const handleRandomFill = useCallback(() => {
    setPicks((prev) => autoFillPicks(prev));
  }, []);

  const handleReset = useCallback(() => {
    setPicks(buildGamePicks());
  }, []);

  const totalGames = picks.length;
  const completedGames = picks.filter(
    (p) =>
      p.homeScore !== null &&
      p.awayScore !== null &&
      p.homeScore !== p.awayScore
  ).length;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Euroleague 2025-26 Play-In Simulator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter scores for remaining games to see how the play-in race
            unfolds. Point differential breaks ties.
          </p>

          <div className="flex items-center gap-4 mt-3">
            {/* Progress */}
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  {completedGames}/{totalGames} games
                </span>
                <span>{Math.round((completedGames / totalGames) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedGames / totalGames) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setFocusMode((f) => !f)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  focusMode
                    ? "bg-yellow-700 text-yellow-100"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {focusMode ? "Focus: Play-In" : "Show All"}
              </button>
              <button
                onClick={handleRandomFill}
                className="px-3 py-1.5 rounded-md text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                Random Fill
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-md text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Game Picker */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-200">
              Remaining Games
              {focusMode && (
                <span className="text-xs text-yellow-500 ml-2 font-normal">
                  Play-in relevant only
                </span>
              )}
            </h2>
            <GamePicker
              picks={picks}
              onScoreChange={handleScoreChange}
              focusMode={focusMode}
            />
          </div>

          {/* Right: Standings + Play-In */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <h2 className="text-base font-semibold text-gray-200 mb-3">
                {focusMode ? "Standings (Play-In Zone)" : "Full Standings"}
              </h2>
              <StandingsTable standings={standings} focusMode={focusMode} />
            </div>

            <PlayInBracket standings={standings} />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-800 border-l-2 border-green-500" />
                <span>Direct Playoffs (1-6)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-yellow-800 border-l-2 border-yellow-500" />
                <span>Play-In (7-10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-800 border-l-2 border-red-500" />
                <span>Eliminated (11+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
