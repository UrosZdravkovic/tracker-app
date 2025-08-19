import { useSessionsCtx } from "../store/sessions-context";

export function useSummaryStats() {
  const { currentSessions } = useSessionsCtx();

  const totalSessions = currentSessions.length;
  const totalTime = currentSessions.reduce((sum, s) => sum + s.time, 0);
  const completedSessions = currentSessions.filter(s => s.status === "completed").length;

  const mostCommonCategory = (() => {
    const categoryMap = new Map<string, number>();
    for (const s of currentSessions) {
      categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + 1);
    }

    const sorted = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "N/A";
  })();

  const completionRate = totalSessions > 0
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  return {
    totalSessions,
    totalTime,
    completedSessions,
    mostCommonCategory,
    completionRate,
  };
}