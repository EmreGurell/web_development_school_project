"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------
   DELETE ACTION (Dialog içinde silme)
--------------------------------------------------------- */
function DeleteAction({ item, config, actions, loadingDelete, onDelete }) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async () => {
        if (actions?.onDelete?.customHandler) {
            await actions.onDelete.customHandler(item);
        } else {
            await onDelete(item);
        }
        setDeleteOpen(false);
    };

    return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loadingDelete === (item.id || item._id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold text-xl">
                        {config.entityName} silinsin mi?
                    </DialogTitle>
                    <p className="text-stone-700 my-1">
                        Bu işlem geri alınamaz.
                    </p>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                        İptal
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loadingDelete === (item.id || item._id)}
                    >
                        {loadingDelete === (item.id || item._id) ? "Siliniyor..." : "Sil"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------------------------------------------------------
   GENERIC TABLE
--------------------------------------------------------- */
export function GenericDataTable({
                                     data,
                                     columns: userColumns= [],
                                     config,
                                     actions,
                                     additionalParams = {},
                                     onDataChange,
                                 }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [createOpen, setCreateOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams ? `?${searchParams.toString()}` : "");

    /* -----------------------------
         DELETE HANDLER
    ----------------------------- */
    const defaultDeleteHandler = async (item) => {
        const itemId = item.id || item._id;
        setLoadingDelete(itemId);

        try {
            let url;

            if (config.endpoints?.delete) {
                url = config.endpoints.delete(itemId, additionalParams);
            } else {
                const params = new URLSearchParams(additionalParams).toString();
                url = `${config.apiEndpoint}/${itemId}${params ? `?${params}` : ""}`;
            }

            const res = await fetch(url, { method: "DELETE" });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Silme işlemi başarısız.");
            }

            toast.success(`${config.entityName} silindi.`);
            onDataChange?.();
            router.replace(currentUrl);
        } catch (err) {
            toast.error(err.message || "Silme başarısız");
        } finally {
            setLoadingDelete(null);
        }
    };

    /* -----------------------------
         TABLE COLUMNS
    ----------------------------- */
    const selectionColumn = {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(val) => row.toggleSelected(!!val)}
                onClick={(e) => e.stopPropagation()}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    };

    const actionsColumn = {
        id: "actions",
        header: "Aksiyonlar",
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex items-center gap-2">
                    {actions?.onEdit?.enabled && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => actions.onEdit.handler(item)}
                        >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    )}

                    {actions?.onDelete?.enabled && 
                     (!actions.onDelete.showIf || actions.onDelete.showIf(item)) && (
                        <DeleteAction
                            item={item}
                            config={config}
                            actions={actions}
                            loadingDelete={loadingDelete}
                            onDelete={defaultDeleteHandler}
                        />
                    )}
                </div>
            );
        },
    };

    const allColumns = [
        selectionColumn,
        ...userColumns,
        (actions?.onEdit?.enabled || actions?.onDelete?.enabled) && actionsColumn
    ].filter(Boolean);

    /* -----------------------------
         TABLE INITIALIZE
    ----------------------------- */
    const table = useReactTable({
        data,
        columns: allColumns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const CreateForm = actions?.onCreate?.component;

    const searchField = String(config.searchField);

    /* ---------------------------------------------------------
       RENDER
    --------------------------------------------------------- */
    return (
        <div className="w-full">

            {/* Search & Column Filter */}
            <div className="flex items-center py-4">
                <Input
                    placeholder={config.searchPlaceholder}
                    value={(table.getColumn(searchField)?.getFilterValue() ?? "")}
                    onChange={(e) =>
                        table.getColumn(searchField)?.setFilterValue(e.target.value)
                    }
                    className="max-w-sm"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Sütunlar
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {table.getAllColumns()
                            .filter(col => col.getCanHide())
                            .map(col => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Create Button */}
                {actions?.onCreate?.enabled && (
                    <>
                        {CreateForm && !actions.onCreate.usePage && (
                            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="ml-3">
                                        <Plus className="w-4 h-4 mr-2" />
                                        {config.entityName} Oluştur
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="font-bold text-xl">
                                            Yeni {config.entityName}
                                        </DialogTitle>
                                    </DialogHeader>

                                    <CreateForm
                                        onSuccess={() => {
                                            setCreateOpen(false);
                                            actions.onCreate.onSuccess?.();
                                            onDataChange?.();
                                        }}
                                        onCancel={() => setCreateOpen(false)}
                                        additionalData={actions.onCreate.additionalData}
                                        {...additionalParams}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}

                        {actions?.onCreate?.usePage && actions.onCreate.pageUrl && (
                            <Button className="ml-3" onClick={() => router.push(actions.onCreate.pageUrl)}>
                                <Plus className="w-4 h-4 mr-2" /> {config.entityName} Oluştur
                            </Button>
                        )}
                    </>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-100">
                        {table.getHeaderGroups().map(group => (
                            <TableRow key={group.id}>
                                {group.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} /
                    {table.getFilteredRowModel().rows.length} seçili.
                </div>

                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Önceki
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Sonraki
                    </Button>
                </div>
            </div>

        </div>
    );
}
