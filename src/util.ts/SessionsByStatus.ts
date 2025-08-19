import { type Session } from "../store/sessions-context";

export function getSessionsByStatusData(sessions: Session[]) {
  const statusCounts: Record<string, number> = {};

  for (const session of sessions) {
    if (!statusCounts[session.status]) {
      statusCounts[session.status] = 0;
    }
    statusCounts[session.status]++;
  }

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));
}