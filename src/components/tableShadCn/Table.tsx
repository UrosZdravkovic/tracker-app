import LessonDataTable from "../tableShadCn/data-table"
import { useSessionsCtx } from '../../store/sessions-context'
import { type Session } from "../../store/sessions-context";
import { useState } from "react";
import EditSession from "../sessions/EditSeesion";
import { createColumns } from "./columns"
import styles from '../table/Table.module.css'

export default function SessionsTableWrapper() {
  const { currentSessions, removeSession } = useSessionsCtx();
  const [editSession, setEditSession] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

  const handleOpenModal = (session: Session) => {
    setSessionToEdit(session);
    setEditSession(true);
  }

  const handleCloseModal = () => {
    setSessionToEdit(null);
    setEditSession(false);
  }

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeSession(id);
    } catch (error) {
      console.error("Error removing session:", error);
    }
    setRemovingId(null);

  }

  if (currentSessions.length === 0) {
        return <p className={styles.empty}>No sessions added yet.</p>;
    }

  return (
    <>
      {editSession && sessionToEdit && (
        <EditSession session={sessionToEdit} onClose={handleCloseModal} />
      )}

      <LessonDataTable
        data={currentSessions}
        columns={createColumns(handleOpenModal, handleRemove, removingId)}
      />
    </>
  )
}
