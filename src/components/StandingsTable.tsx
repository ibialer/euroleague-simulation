"use client";

import { type ProjectedStandings, PLAY_IN_BATTLE_TEAMS } from "@/lib/simulation";

interface Props {
  standings: ProjectedStandings[];
  focusMode: boolean;
}

function getZoneClass(rank: number): string {
  if (rank <= 6) return "bg-green-900/30 border-l-4 border-green-500";
  if (rank <= 10) return "bg-yellow-900/30 border-l-4 border-yellow-500";
  return "bg-red-900/30 border-l-4 border-red-500";
}

function getZoneLabel(rank: number): string {
  if (rank <= 6) return "Playoffs";
  if (rank <= 10) return "Play-In";
  return "Out";
}

export default function StandingsTable({ standings, focusMode }: Props) {
  const displayStandings = focusMode
    ? standings.filter((t) => t.finalRank >= 4 && t.finalRank <= 13)
    : standings;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
            <th className="py-2 px-2 text-left">#</th>
            <th className="py-2 px-2 text-left">Team</th>
            <th className="py-2 px-2 text-center">W-L</th>
            <th className="py-2 px-2 text-center">Proj.</th>
            <th className="py-2 px-2 text-center">+/-</th>
            <th className="py-2 px-2 text-center">Zone</th>
            <th className="py-2 px-2 text-center">Move</th>
          </tr>
        </thead>
        <tbody>
          {displayStandings.map((team, i) => {
            const isBattleTeam = PLAY_IN_BATTLE_TEAMS.has(team.team);
            const prevRank = displayStandings[i - 1]?.finalRank;
            const showDivider =
              (prevRank && prevRank <= 6 && team.finalRank > 6) ||
              (prevRank && prevRank <= 10 && team.finalRank > 10);

            return (
              <tr
                key={team.code}
                className={`${getZoneClass(team.finalRank)} ${
                  isBattleTeam ? "font-semibold" : "opacity-75"
                } ${showDivider ? "border-t-2 border-gray-500" : ""}`}
              >
                <td className="py-2 px-2 text-gray-300">{team.finalRank}</td>
                <td className="py-2 px-2 text-white">{team.team}</td>
                <td className="py-2 px-2 text-center text-gray-400 font-mono text-xs">
                  {team.wins}-{team.losses}
                </td>
                <td className="py-2 px-2 text-center font-mono">
                  <span className="text-white">
                    {team.totalWins}-{team.totalLosses}
                  </span>
                  {team.addedWins + team.addedLosses > 0 && (
                    <span className="text-gray-500 text-xs ml-1">
                      (+{team.addedWins})
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 text-center font-mono text-xs">
                  <span
                    className={
                      team.pointDiff > 0
                        ? "text-green-400"
                        : team.pointDiff < 0
                        ? "text-red-400"
                        : "text-gray-500"
                    }
                  >
                    {team.pointDiff > 0 ? "+" : ""}
                    {team.pointDiff}
                  </span>
                </td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      team.finalRank <= 6
                        ? "bg-green-800 text-green-300"
                        : team.finalRank <= 10
                        ? "bg-yellow-800 text-yellow-300"
                        : "bg-red-800 text-red-300"
                    }`}
                  >
                    {getZoneLabel(team.finalRank)}
                  </span>
                </td>
                <td className="py-2 px-2 text-center">
                  {team.rankChange > 0 && (
                    <span className="text-green-400">▲{team.rankChange}</span>
                  )}
                  {team.rankChange < 0 && (
                    <span className="text-red-400">▼{Math.abs(team.rankChange)}</span>
                  )}
                  {team.rankChange === 0 && (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
