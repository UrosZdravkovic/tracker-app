import { type Session } from "../store/sessions-context";

export function getSessionsByCategoryData(sessions: Session[]) {
  const categoryCounts: Record<string, number> = {};

  for (const session of sessions) {
    if (!categoryCounts[session.category]) {
      categoryCounts[session.category] = 0;
    }
    categoryCounts[session.category]++;
  }

  return Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    value: count,
  }));
}