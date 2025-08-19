import { useState } from "react";
import { useSessionsCtx, type Session } from "../../../store/sessions-context";
import styles from "./RecentSessions.module.css";
import EditSession from "../../sessions/EditSeesion";
import Spinner from "../../../uiLoaders/Spinner";
import { FaBook, FaEdit, FaTrash } from "react-icons/fa";
import SessionTooltip from "./sessionTooltip";

export default function RecentSessionsList() {
  const { currentSessions, removeSession } = useSessionsCtx();
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);
  const [isRemovingId, setIsRemovingId] = useState<string | null>(null);

  const sorted = [...currentSessions].sort((a, b) => Number(b.id) - Number(a.id));
  const recent = sorted.slice(0, 5);

  function openModal(session: Session) {
    setSessionToEdit(session);
  }

  function closeModal() {
    setSessionToEdit(null);
  }

  async function handleRemove(id: string) {
    setIsRemovingId(id);
    await removeSession(id);
    setIsRemovingId(null);
  }

  if (recent.length === 0) {
    return <p className={styles.empty}>No recent sessions</p>;
  }

  return (
    <div className={styles.container} >
      {sessionToEdit && (
        <EditSession session={sessionToEdit} onClose={closeModal} />
      )}

      <h2 className={styles.heading}>Recent Sessions</h2>
      <ul className={styles.list}>
        {recent.map((s) => (
          <li key={s.id} className={styles.item}>
            <div className={styles.row}>
              <div className={styles.left}>
                <FaBook className={styles.icon} />
                <span className={styles.lesson}>{s.lesson}</span>
              </div>

              <div className={styles.actions}>
                <SessionTooltip content={s}>
                  <button className={styles.button} onClick={() => openModal(s)}>
                    <FaEdit className={styles.icon} />
                    <span className={styles.actionButtonSpan}>Edit</span>
                  </button>
                </SessionTooltip>
                <button
                  className={styles.button}
                  onClick={() => handleRemove(s.id)}
                  disabled={isRemovingId === s.id}
                >
                  {isRemovingId === s.id ? (
                    <Spinner size={12} text={true} />
                  ) : (
                    <>
                      <FaTrash className={styles.icon} />
                      <span className={styles.actionButtonSpan}>Remove</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
