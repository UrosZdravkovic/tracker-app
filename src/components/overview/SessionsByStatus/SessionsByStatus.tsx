import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";
  import styles from "./SessionsByStatus.module.css";
  import { useSessionsCtx } from "../../../store/sessions-context";
  import { getSessionsByStatusData } from "../../../util.ts/SessionsByStatus";
  
  const COLORS = ["#3B82F6"];
  
  export default function SessionsByStatusChart() {
    const { currentSessions } = useSessionsCtx();
  
    const data = getSessionsByStatusData(currentSessions);
  
    if (data.length === 0) {
      return <p className={styles.empty}>No available sessions</p>;
    }
  
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Sessions by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }