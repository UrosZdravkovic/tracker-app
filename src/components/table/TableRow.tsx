import { useState } from "react";
import { type Session } from "../../store/sessions-context";
import { useSessionsCtx } from '../../store/sessions-context';
import styles from './Table.module.css'
import { FaEdit, FaTrash } from "react-icons/fa";

import Spinner from "../../uiLoaders/Spinner";

type TableRowProps = {
    id: string,
    lesson: string,
    time: number,
    status: string;
    category: string;
    userId: string,
    openModal: (session: Session) => void;
}

export default function TableRow({ id, userId, lesson, time, category, status, openModal }: TableRowProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const sessionsCtx = useSessionsCtx();

    async function handleRemove(id: string) {
        setIsRemoving(true);
        try {
            await sessionsCtx.removeSession(id);
        } catch (error) {
            console.error("Error removing session:", error);
        }
        setIsRemoving(false);
    }

    return (
        <tr key={id}>
            <td data-label="Lesson">
                {lesson}
            </td>
            <td data-label="Time">{time}</td>
            <td data-label="Category">{category}</td>
            <td data-label="Status">{status}</td>
            <td data-label="Actions" className={styles.actions}>
                <button
                    className={styles.button}
                    onClick={() => openModal({ id, lesson, time, category, status, userId })}
                    disabled={isRemoving}
                >
                    <FaEdit className={styles.icon} />
                </button>

                <button
                    className={styles.button}
                    onClick={() => handleRemove(id)}
                    disabled={isRemoving}
                >
                    {isRemoving ? (
                        <Spinner size={12} text={true} />
                    ) : (
                        <>
                            <FaTrash className={styles.icon} />
                        </>
                    )}
                </button>
            </td>

        </tr>
    );

}
