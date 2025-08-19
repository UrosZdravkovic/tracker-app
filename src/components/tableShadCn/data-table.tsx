import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getFilteredRowModel,
    type ColumnFiltersState
} from "@tanstack/react-table";

import styles from "../../components/table/Table.module.css";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onEdit?: (session: TData) => void;
    onDelete?: (id: string) => void;
}


export default function LessonDataTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "time", desc: true }
    ]);

    function toggleSorting(columnId: string) {
        setSorting(prev => {
            const current = prev.find(sort => sort.id === columnId);
            if (!current) {
                return [{ id: columnId, desc: false }];
            }
            return [{ id: columnId, desc: !current.desc }];
        });
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',

    });

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.filterRow}>
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className={styles.searchInput}
                />

                <Select
                    value={table.getColumn("category")?.getFilterValue() as string ?? ""}
                    onValueChange={(value) =>
                        table.getColumn("category")?.setFilterValue(value === "all" ? undefined : value)
                    }
                >
                    <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={table.getColumn("status")?.getFilterValue() as string ?? ""}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
                    }
                >
                    <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="started">Started</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table className={styles.table}>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead
                                    key={header.id}
                                    onClick={
                                        header.column.getCanSort()
                                            ? () => toggleSorting(header.column.id)
                                            : undefined
                                    }
                                    className={`${styles.th} ${header.column.getCanSort() ? styles.sortable : ""}`}
                                >
                                    <div className={styles.sortableContent}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc" && <ArrowUp size={16} />}
                                        {header.column.getIsSorted() === "desc" && <ArrowDown size={16} />}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className={styles.td}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className={styles.empty}>
                                No Results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
