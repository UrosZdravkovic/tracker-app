import { useSessionsCtx } from "../store/sessions-context";

import RecentSessionsList from "../components/overview/RecentSessions/RecentSessions";
import SessionsByCategoryChart from "../components/overview/SessionsByCategory/SessionsByCategory";
import SessionsByStatusChart from "../components/overview/SessionsByStatus/SessionsByStatus";
import SummaryCards from "../components/overview/SummaryCards/SummaryCards";
import Loading from "../uiLoaders/Loading";
import NoRecentSessions from "../components/overview/NoRecentSessions/NoRecentSessions";
import styles from './MainPage.module.css';
import { useAuth } from "../store/auth-context";


export default function MainPage() {
  const { isLoading, currentSessions } = useSessionsCtx();
  const { user } = useAuth()

  const userHasSessions = currentSessions.some((session) => session.userId === user?.uid)

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {!userHasSessions ? <NoRecentSessions /> :
        <>
          <SummaryCards />
          <div className={styles.gridSection}>
            <SessionsByCategoryChart />
            <SessionsByStatusChart />
            <RecentSessionsList />

          </div>
        </>
      }

    </>


  );
}