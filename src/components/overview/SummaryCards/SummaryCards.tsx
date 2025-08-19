import styles from "./SummaryCards.module.css";
import Card from "./Card";
import { useSummaryStats } from "../../../util.ts/SummaryCards"

export default function SummaryCards() {
  const {
    totalSessions,
    totalTime,
    mostCommonCategory,
    completionRate,
  } = useSummaryStats();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Summary</h2>
      <div className={styles.grid}>
        <Card title="Total Sessions" value={totalSessions.toString()} />
        <Card
          title="Total Time"
          value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}min`}
        />
        <Card title="Most used Category" value={mostCommonCategory} />
        <Card title="Completed Sessions" value={`${completionRate}%`} />
      </div>
    </div>
  );
}