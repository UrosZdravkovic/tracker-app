import type { Session } from "@/store/sessions-context"
import type { ColumnDef } from "@tanstack/react-table"
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from '../../components/table/Table.module.css'
import Spinner from '../../uiLoaders/Spinner'

export const createColumns = (
  onEdit: (session: Session) => void,
  onDelete: (id: string) => void,
  removingId: string | null
): ColumnDef<Session>[] => [
    { accessorKey: "lesson", header: "Lesson", enableSorting: false, enableGlobalFilter: true, filterFn: "includesString", },
    { accessorKey: "time", header: "Time (min)", enableSorting: true, enableGlobalFilter: false },
    { accessorKey: "category", header: "Category", enableSorting: false, enableGlobalFilter: false, enableColumnFilter: true, },
    { accessorKey: "status", header: "Status", enableSorting: false, enableGlobalFilter: false },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className={styles.actions}>
            <button
              onClick={() => onEdit(session)}
              className={styles.button}
            >
              <FaEdit className={styles.icon} />
            </button>
            {removingId === session.id ? (
              <Spinner size={12} text={false} />
            ) : (
              <button
                onClick={() => onDelete(session.id)}
                className={styles.button}
              >
                <FaTrash className={styles.icon} />
              </button>
            )}
          </div>
        );
      },
    },
  ]