"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type CatalogTableProps<T extends { [k: string]: unknown }> = {
  title: string;
  addLabel: string;
  data: T[];
  columns: Column<T>[];
  idKey: keyof T;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  canWrite?: boolean;
};

export function CatalogTable<T extends { [k: string]: unknown }>({
  title, addLabel, data, columns, idKey, onAdd, onEdit, onDelete,
  loading = false, searchable = true, searchKeys = [], canWrite = true,
}: CatalogTableProps<T>) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = search.trim()
    ? data.filter((row) =>
        (searchKeys.length ? searchKeys : (Object.keys(row) as (keyof T)[])).some((k) =>
          String(row[k] ?? "").toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {canWrite && (
          <Button onClick={onAdd} size="sm" className="shrink-0">
            <Plus data-icon="inline-start" />
            {addLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="text-xs font-semibold uppercase tracking-wide">
                  {col.label}
                </TableHead>
              ))}
              {canWrite && <TableHead className="w-24 text-right text-xs font-semibold uppercase tracking-wide">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                  {canWrite && <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (canWrite ? 1 : 0)} className="text-center py-12 text-muted-foreground text-sm">
                  {search ? "No se encontraron resultados para la búsqueda." : "No hay registros disponibles."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={String(row[idKey])} className="group">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="py-3">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                  {canWrite && (
                    <TableCell className="py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(row)}>
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(Number(row[idKey]))}
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/20">
            {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
            {search && ` encontrados de ${data.length} total`}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId !== null) onDelete?.(deleteId);
                setDeleteId(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Badge for estado activo
export function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        activo
          ? "text-chart-2 border-chart-2/40 bg-chart-2/10 font-medium"
          : "text-muted-foreground border-border bg-muted/40 font-medium"
      }
    >
      {activo ? "Activo" : "Inactivo"}
    </Badge>
  );
}
