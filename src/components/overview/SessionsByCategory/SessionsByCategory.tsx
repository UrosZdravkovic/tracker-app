import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./SessionsByCategory.module.css";
import { useSessionsCtx } from "../../../store/sessions-context";
import { getSessionsByCategoryData } from '../../../util.ts/SessionsByCategory'

const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#A855F7"];

export default function SessionsByCategoryChart() {
  const { currentSessions } = useSessionsCtx();

  const data = getSessionsByCategoryData(currentSessions);

  if (data.length === 0) {
    return <p className={styles.empty}>No available sessions</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Sessions by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={90} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}