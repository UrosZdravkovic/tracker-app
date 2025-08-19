import styles from "../NoRecentSessions/NoRecentSessions.module.css"
import noSessionsImg from '../../../assets/NoSessions.png'
import AddSession from "../../sessions/AddSession"
import { useState } from "react"



export default function NoRecentSessions() {
  const [isAddingSession, setIsAddingSession] = useState(false);

  function handleAddSession() {
    setIsAddingSession(true);
  }

  function handleCancelAdding() {
    setIsAddingSession(false);
  }


  return (
    <>
      {isAddingSession && <AddSession onClose={handleCancelAdding} />}
      <div className={styles.emptyState}>
        <img src={noSessionsImg} alt="No sessions illustration" className={styles.image} />
        <h2 className={styles.title}>No sessions yet</h2>
        <p className={styles.subtitle}>
          You haven't added any sessions yet. Start tracking your progress!
        </p>
        <button onClick={handleAddSession} className={styles.addButton}>
          + Add First Session
        </button>
      </div>
    </>
  );
}
