import { useSessionsCtx } from "../../store/sessions-context";
import { useState } from "react";

import { type Session } from "../../store/sessions-context";
import styles from './Table.module.css'
import TableRow from "./TableRow";
import EditSession from "../sessions/EditSeesion";

export default function Table() {

    const [editSession, setEditSession] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

    function handleOpenModal(session: Session) {
        setSessionToEdit(session);
        setEditSession(true)
    }

    function handleCloseModal() {
        setEditSession(false)
        setSessionToEdit(null);
    }

    const { currentSessions } = useSessionsCtx()

    if (currentSessions.length === 0) {
        return <p className={styles.empty}>No sessions added yet.</p>;
    }

    return (
        <>
            {(sessionToEdit && editSession) && <EditSession session={sessionToEdit} onClose={handleCloseModal} />}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Lesson</th>
                        <th>Time (min)</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSessions.map((session) => (
                        <TableRow key={session.id} openModal={handleOpenModal} {...session} />
                    ))}
                </tbody>
            </table>
        </>
    );
}
